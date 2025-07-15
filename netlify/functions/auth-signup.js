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
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and password are required' }),
      };
    }

    // Sign up user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          free_trial_uses: 3,
          subscription_plan: 'free',
        }
      }
    });

    if (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }

    // Create user profile in custom table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: data.user.id,
            email: data.user.email,
            free_trial_uses: 3,
            subscription_plan: 'free',
            created_at: new Date().toISOString(),
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue even if profile creation fails
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'User created successfully',
        user: {
          id: data.user?.id,
          email: data.user?.email,
          email_confirmed_at: data.user?.email_confirmed_at,
        },
        session: data.session ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        } : null,
      }),
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};