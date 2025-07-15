const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('./supabase-config');

// Plan configurations
const PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 999, // $9.99 CAD in cents
    currency: 'cad',
    interval: 'month',
    features: ['10 AI lesson plans per month', 'Basic templates', 'Email support'],
  },
  unlimited: {
    name: 'Unlimited Plan',
    price: 1999, // $19.99 CAD in cents
    currency: 'cad',
    interval: 'month',
    features: ['Unlimited AI lesson plans', 'Premium templates', 'Priority support', 'Advanced features'],
  },
  professional: {
    name: 'Professional Plan',
    price: 7999, // $79.99 CAD in cents
    currency: 'cad',
    interval: 'month',
    features: ['Everything in Unlimited', 'Multi-user access', 'Custom branding', 'Dedicated support'],
  },
};

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
    const { planId, successUrl, cancelUrl } = JSON.parse(event.body);

    if (!planId || !PLANS[planId]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid plan ID' }),
      };
    }

    // Get user from auth token
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication required' }),
      };
    }

    const token = authHeader.substring(7);
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !userData.user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid authentication token' }),
      };
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userData.user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: {
          supabase_user_id: userData.user.id,
        },
      });

      customerId = customer.id;

      // Update user profile with customer ID
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userData.user.id);
    }

    const plan = PLANS[planId];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            product_data: {
              name: plan.name,
              description: `KatoKits ${plan.name} - ${plan.features.join(', ')}`,
            },
            unit_amount: plan.price,
            recurring: {
              interval: plan.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.URL}/dashboard.html?success=true`,
      cancel_url: cancelUrl || `${process.env.URL}/pricing.html?canceled=true`,
      metadata: {
        supabase_user_id: userData.user.id,
        plan_id: planId,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};