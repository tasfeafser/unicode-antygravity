import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';

const pricingMap: Record<string, string> = {
  [process.env.STRIPE_PRO_PRICE_ID!]: 'pro',
  [process.env.STRIPE_TEAM_PRICE_ID!]: 'team',
  [process.env.STRIPE_ENTERPRISE_PRICE_ID!]: 'enterprise',
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  // 1. Handle Checkout Completed
  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const clerkId = session.client_reference_id; // Pass this in checkout creation

    // Get the profile_id from clerk_id
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    if (profile) {
      await supabaseAdmin.from('subscriptions').upsert({
        profile_id: profile.id,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        tier: pricingMap[subscription.items.data[0].price.id] || 'pro',
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, { onConflict: 'profile_id' });
    }
  }

  // 2. Handle Subscription Updated/Deleted
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: subscription.status,
        tier: pricingMap[subscription.items.data[0].price.id] || 'pro',
        price_id: subscription.items.data[0].price.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  return new NextResponse(null, { status: 200 });
}
