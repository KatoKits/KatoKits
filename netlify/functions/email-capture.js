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
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Store email in database
    const { data, error } = await supabase
      .from('email_signups')
      .insert([
        {
          email,
          created_at: new Date().toISOString(),
          source: 'website_signup',
          free_trial_granted: true
        }
      ])
      .select();

    if (error && error.code === '23505') { // Unique constraint violation
      // Email already exists, update the record
      const { data: updateData, error: updateError } = await supabase
        .from('email_signups')
        .update({ updated_at: new Date().toISOString() })
        .eq('email', email)
        .select();

      if (updateError) {
        console.error('Email signup update error:', updateError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to process email signup' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Email already registered',
          signup_id: updateData[0]?.id,
          free_trial_uses: 3,
        }),
      };
    } else if (error) {
      console.error('Email signup error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to process email signup' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Email captured successfully',
        signup_id: data[0]?.id,
        free_trial_uses: 3,
      }),
    };
  } catch (error) {
    console.error('Email capture error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};