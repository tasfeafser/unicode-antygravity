import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!profile) {
    return NextResponse.json({ tier: 'free', status: 'none' });
  }

  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('tier, status, current_period_end, cancel_at_period_end')
    .eq('profile_id', profile.id)
    .single();

  if (!subscription) {
    return NextResponse.json({ tier: 'free', status: 'none' });
  }

  return NextResponse.json(subscription);
}
