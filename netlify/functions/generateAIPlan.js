const { Configuration, OpenAIApi } = require('openai');
const { supabase } = require('./supabase-config');

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { prompt, email } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Check usage before generating
    const authHeader = event.headers.authorization;
    let userId = null;
    let canGenerate = false;

    // Try to get user from auth token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: userData, error: authError } = await supabase.auth.getUser(token);
      if (!authError && userData.user) {
        userId = userData.user.id;

        // Check usage for authenticated user
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('free_trial_uses, subscription_plan')
          .eq('user_id', userId)
          .single();

        canGenerate = profile?.subscription_plan !== 'free' || (profile?.free_trial_uses || 0) > 0;
      }
    } else if (email) {
      // Check usage for non-authenticated user with email
      const { data: emailRecord } = await supabase
        .from('email_signups')
        .select('free_trial_uses')
        .eq('email', email)
        .single();

      canGenerate = emailRecord && (emailRecord.free_trial_uses || 0) > 0;
    }

    if (!canGenerate) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: 'Free trial limit reached. Please sign up or upgrade your plan.',
          upgrade_required: true
        }),
      };
    }

    // Generate AI content
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `
Create a highly detailed preschool lesson plan for: ${prompt}.
- Include clear objectives, a list of materials, and a step-by-step procedure.
- For each step, provide in-depth teaching strategies, open-ended questions, and prompts to encourage ongoing engagement and critical thinking.
- Suggest ways to extend the activity if children lose interest or finish early.
- Include a developmental checklist with specific observable skills (social, cognitive, language, fine/gross motor).
- Make the plan easy for teachers to follow and adaptable for different learning styles.
`,
      temperature: 0.8,
      max_tokens: 1200,
    });

    // Record usage after successful generation
    if (userId) {
      // Update for authenticated user
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('free_trial_uses, subscription_plan, ai_generations_used')
        .eq('user_id', userId)
        .single();

      const updates = { ai_generations_used: (profile?.ai_generations_used || 0) + 1 };
      if (profile?.subscription_plan === 'free') {
        updates.free_trial_uses = Math.max(0, (profile?.free_trial_uses || 0) - 1);
      }

      await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId);
    } else if (email) {
      // Update for email user
      const { data: emailRecord } = await supabase
        .from('email_signups')
        .select('free_trial_uses, ai_generations_used')
        .eq('email', email)
        .single();

      await supabase
        .from('email_signups')
        .update({
          free_trial_uses: Math.max(0, (emailRecord?.free_trial_uses || 0) - 1),
          ai_generations_used: (emailRecord?.ai_generations_used || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        plan: response.data.choices[0].text,
        usage_updated: true
      }),
    };

  } catch (error) {
    console.error('AI Plan generation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate lesson plan' }),
    };
  }
};
