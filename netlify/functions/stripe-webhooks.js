const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('./supabase-config');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
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

  const signature = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(event.body, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Webhook signature verification failed' }),
    };
  }

  try {
    // Log the event
    console.log('Stripe webhook event:', stripeEvent.type);

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    // Log the event in our database
    await supabase
      .from('subscription_events')
      .insert([
        {
          stripe_event_id: stripeEvent.id,
          event_type: stripeEvent.type,
          subscription_id: stripeEvent.data.object.subscription || stripeEvent.data.object.id,
          customer_id: stripeEvent.data.object.customer,
          status: 'processed',
        }
      ]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Log failed event
    try {
      await supabase
        .from('subscription_events')
        .insert([
          {
            stripe_event_id: stripeEvent.id,
            event_type: stripeEvent.type,
            subscription_id: stripeEvent.data.object.subscription || stripeEvent.data.object.id,
            customer_id: stripeEvent.data.object.customer,
            status: 'failed',
          }
        ]);
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    };
  }
};

async function handleCheckoutCompleted(session) {
  const { customer, subscription, metadata } = session;
  const userId = metadata?.supabase_user_id;
  const planId = metadata?.plan_id;

  if (!userId) {
    console.error('No supabase_user_id in checkout session metadata');
    return;
  }

  // Update user profile with subscription info
  await supabase
    .from('user_profiles')
    .update({
      stripe_customer_id: customer,
      stripe_subscription_id: subscription,
      subscription_plan: planId || 'basic',
    })
    .eq('user_id', userId);

  console.log(`Checkout completed for user ${userId}, plan: ${planId}`);
}

async function handleSubscriptionCreated(subscription) {
  const { customer, id: subscriptionId, items } = subscription;
  
  // Get user by customer ID
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customer)
    .single();

  if (!profile) {
    console.error(`No user found for customer ${customer}`);
    return;
  }

  // Determine plan based on subscription items
  let planId = 'basic'; // default
  if (items?.data?.[0]?.price?.unit_amount) {
    const amount = items.data[0].price.unit_amount;
    if (amount >= 7999) planId = 'professional';
    else if (amount >= 1999) planId = 'unlimited';
    else planId = 'basic';
  }

  await supabase
    .from('user_profiles')
    .update({
      stripe_subscription_id: subscriptionId,
      subscription_plan: planId,
    })
    .eq('user_id', profile.user_id);

  console.log(`Subscription created for user ${profile.user_id}, plan: ${planId}`);
}

async function handleSubscriptionUpdated(subscription) {
  const { customer, id: subscriptionId, items, status } = subscription;
  
  // Get user by customer ID
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customer)
    .single();

  if (!profile) {
    console.error(`No user found for customer ${customer}`);
    return;
  }

  let planId = 'basic';
  if (status === 'active' && items?.data?.[0]?.price?.unit_amount) {
    const amount = items.data[0].price.unit_amount;
    if (amount >= 7999) planId = 'professional';
    else if (amount >= 1999) planId = 'unlimited';
    else planId = 'basic';
  } else if (status !== 'active') {
    planId = 'free'; // Subscription is not active
  }

  await supabase
    .from('user_profiles')
    .update({
      subscription_plan: planId,
    })
    .eq('user_id', profile.user_id);

  console.log(`Subscription updated for user ${profile.user_id}, plan: ${planId}, status: ${status}`);
}

async function handleSubscriptionDeleted(subscription) {
  const { customer } = subscription;
  
  // Get user by customer ID
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customer)
    .single();

  if (!profile) {
    console.error(`No user found for customer ${customer}`);
    return;
  }

  // Revert to free plan
  await supabase
    .from('user_profiles')
    .update({
      subscription_plan: 'free',
      stripe_subscription_id: null,
    })
    .eq('user_id', profile.user_id);

  console.log(`Subscription deleted for user ${profile.user_id}, reverted to free plan`);
}

async function handlePaymentSucceeded(invoice) {
  const { customer, subscription } = invoice;
  
  // Get user by customer ID
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customer)
    .single();

  if (!profile) {
    console.error(`No user found for customer ${customer}`);
    return;
  }

  console.log(`Payment succeeded for user ${profile.user_id}, subscription: ${subscription}`);
}

async function handlePaymentFailed(invoice) {
  const { customer, subscription } = invoice;
  
  // Get user by customer ID
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('stripe_customer_id', customer)
    .single();

  if (!profile) {
    console.error(`No user found for customer ${customer}`);
    return;
  }

  // Optionally handle payment failures (e.g., send notification, downgrade plan after grace period)
  console.log(`Payment failed for user ${profile.user_id}, subscription: ${subscription}`);
}