"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  priceId?: string;
  isPopular?: boolean;
}

export function PricingCard({ name, price, description, features, priceId, isPopular }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!priceId) {
      // Enterprise or Free
      if (name === 'Enterprise') window.location.href = 'mailto:sales@unicode.edu';
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        const errorData = await res.text();
        console.error("Subscription failed", errorData);
      }
    } catch (err) {
      console.error("Subscription failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 rounded-2xl flex flex-col h-full bg-card border-2 transition-all hover:scale-[1.02] ${isPopular ? 'border-purple-500 shadow-xl' : 'border-border'}`}>
      {isPopular && (
        <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-muted-foreground">/mo</span>
      </div>
      <p className="text-muted-foreground mb-8 min-h-[48px]">{description}</p>
      
      <div className="space-y-4 mb-8 flex-grow">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading || (!priceId && name !== 'Enterprise')}
        className={`w-full py-4 rounded-xl font-bold transition ${
          isPopular 
            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
        } disabled:opacity-50`}
      >
        {loading ? 'Processing...' : (name === 'Enterprise' ? 'Contact Sales' : (priceId ? 'Get Started' : 'Current Plan'))}
      </button>
    </div>
  );
}
