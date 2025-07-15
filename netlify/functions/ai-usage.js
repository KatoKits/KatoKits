const { supabase } = require('./supabase-config');

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  try {
    const authHeader = event.headers.authorization;
    let userId = null;
    let userEmail = null;

    // Try to get user from auth token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: userData, error: authError } = await supabase.auth.getUser(token);
      if (!authError && userData.user) {
        userId = userData.user.id;
        userEmail = userData.user.email;
      }
    }

    if (event.httpMethod === 'GET') {
      // Get AI usage for authenticated user
      if (!userId) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Authentication required' }),
        };
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('free_trial_uses, subscription_plan, ai_generations_used')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Get AI usage error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to get usage data' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          free_trial_uses: profile?.free_trial_uses || 0,
          subscription_plan: profile?.subscription_plan || 'free',
          ai_generations_used: profile?.ai_generations_used || 0,
          can_generate: profile?.subscription_plan !== 'free' || (profile?.free_trial_uses || 0) > 0,
        }),
      };
    }

    if (event.httpMethod === 'POST') {
      const { email } = JSON.parse(event.body || '{}');

      // For authenticated users
      if (userId) {
        // Check current usage
        const { data: profile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('free_trial_uses, subscription_plan, ai_generations_used')
          .eq('user_id', userId)
          .single();

        if (fetchError) {
          console.error('Fetch profile error:', fetchError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to check usage' }),
          };
        }

        // Check if user can generate
        if (profile?.subscription_plan === 'free' && (profile?.free_trial_uses || 0) <= 0) {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ 
              error: 'Free trial limit reached',
              subscription_required: true 
            }),
          };
        }

        // Update usage
        const updates = { ai_generations_used: (profile?.ai_generations_used || 0) + 1 };
        if (profile?.subscription_plan === 'free') {
          updates.free_trial_uses = Math.max(0, (profile?.free_trial_uses || 0) - 1);
        }

        const { error: updateError } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('user_id', userId);

        if (updateError) {
          console.error('Update usage error:', updateError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update usage' }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'AI usage recorded',
            remaining_free_uses: updates.free_trial_uses,
            can_continue: profile?.subscription_plan !== 'free' || updates.free_trial_uses > 0,
          }),
        };
      }

      // For non-authenticated users with email
      if (email) {
        // Check email signup record
        const { data: emailRecord, error: emailError } = await supabase
          .from('email_signups')
          .select('free_trial_uses, ai_generations_used')
          .eq('email', email)
          .single();

        if (emailError && emailError.code !== 'PGRST116') { // Not found is OK
          console.error('Email record error:', emailError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to check usage' }),
          };
        }

        // If no record or no free uses left
        if (!emailRecord || (emailRecord.free_trial_uses || 0) <= 0) {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ 
              error: 'Free trial limit reached',
              signup_required: true 
            }),
          };
        }

        // Update usage for email record
        const { error: updateError } = await supabase
          .from('email_signups')
          .update({
            free_trial_uses: Math.max(0, (emailRecord.free_trial_uses || 0) - 1),
            ai_generations_used: (emailRecord.ai_generations_used || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('email', email);

        if (updateError) {
          console.error('Update email usage error:', updateError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update usage' }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'AI usage recorded',
            remaining_free_uses: Math.max(0, (emailRecord.free_trial_uses || 0) - 1),
            can_continue: (emailRecord.free_trial_uses || 0) > 1,
          }),
        };
      }

      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication or email required' }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('AI usage error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};