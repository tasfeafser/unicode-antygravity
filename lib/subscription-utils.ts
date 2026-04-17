import { supabaseAdmin } from './supabase-admin';

export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export async function getSubscription(profileId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('tier, status, current_period_end, cancel_at_period_end')
    .eq('profile_id', profileId)
    .single();

  if (error || !data) return null;

  return {
    tier: data.tier as SubscriptionTier,
    status: data.status,
    currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : null,
    cancelAtPeriodEnd: data.cancel_at_period_end || false,
  };
}

export function hasFeatureAccess(subscription: UserSubscription | null, requiredTier: SubscriptionTier): boolean {
  if (!subscription) return requiredTier === 'free';
  
  const tiers: SubscriptionTier[] = ['free', 'pro', 'team', 'enterprise'];
  const userTierIndex = tiers.indexOf(subscription.tier);
  const requiredTierIndex = tiers.indexOf(requiredTier);
  
  return userTierIndex >= requiredTierIndex && subscription.status === 'active';
}
