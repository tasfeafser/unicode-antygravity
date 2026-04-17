import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the stripe_customer_id from the profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!profile) return new NextResponse('Profile not found', { status: 404 });

    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('profile_id', profile.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return new NextResponse('No active subscription', { status: 400 });
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Stripe Portal Error:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}
