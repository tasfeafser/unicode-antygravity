"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SubscriptionTier, UserSubscription, hasFeatureAccess } from "@/lib/subscription-utils";

interface FeatureGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredTier?: SubscriptionTier;
}

export function FeatureGate({ children, fallback, requiredTier = 'pro' }: FeatureGateProps) {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) return;
      try {
        // Fetch from profile or subscription table
        // For simplicity in a client component, we might want a dedicated API route or use a global state
        const res = await fetch('/api/subscription');
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch (err) {
        console.error("Failed to fetch subscription", err);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user) {
      fetchSubscription();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  if (loading || !isLoaded) return null;

  const hasAccess = hasFeatureAccess(subscription, requiredTier);

  if (!hasAccess) {
    return fallback || (
      <div className="p-6 border border-dashed rounded-lg bg-muted/50 text-center">
        <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This feature requires a {requiredTier} subscription.
        </p>
        <button 
          onClick={() => window.location.href = '/billing'}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
