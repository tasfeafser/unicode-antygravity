import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getSubscription } from "@/lib/subscription-utils";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PricingCard } from "@/components/billing/PricingCard";
import { CreditCard, Calendar, ArrowUpCircle } from "lucide-react";

export default async function BillingPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  // Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  const subscription = profile ? await getSubscription(profile.id) : null;

  const tiers = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for learning the basics of Computer Science.",
      features: ["Limited IDE features", "Community support", "Public projects only", "Basic AI assistance"],
    },
    {
      name: "Pro",
      price: "19",
      description: "Best for developers looking for full AI power.",
      features: ["Full Unicode IDE", "Advanced AI features", "Private projects", "14-day free trial", "Priority support"],
      priceId: process.env.STRIPE_PRO_PRICE_ID,
      isPopular: true,
    },
    {
      name: "Team",
      price: "49",
      description: "Collaborate with your team on complex projects.",
      features: ["Everything in Pro", "Collaboration features", "Team workspaces", "Shared project hosting", "Dedicated support"],
      priceId: process.env.STRIPE_TEAM_PRICE_ID,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large academic institutions.",
      features: ["Custom deployments", "SLA guarantees", "Advanced security", "Unlimited everything", "Dedicated account manager"],
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Subscription & Billing</h1>
        <p className="text-muted-foreground">Manage your plan, payment methods, and view your billing history.</p>
      </div>

      {subscription && subscription.tier !== 'free' && (
        <div className="mb-16 bg-muted/30 border rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4" /> Current Plan
            </span>
            <span className="text-2xl font-bold capitalize">{subscription.tier} Plan</span>
            <span className={`text-xs w-fit px-2 py-1 rounded-md font-medium ${subscription.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
              {subscription.status.toUpperCase()}
            </span>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Billing Cycle
            </span>
            <span className="text-xl font-medium">
              Next payment: {subscription.currentPeriodEnd?.toLocaleDateString()}
            </span>
            {subscription.cancelAtPeriodEnd && (
              <span className="text-xs text-red-500 font-medium">Cancels on final period date</span>
            )}
          </div>

          <div className="flex items-center justify-end">
             <form action="/api/stripe/portal" method="POST">
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg font-semibold transition"
                >
                  <CreditCard className="h-5 w-5" /> Manage Billing
                </button>
             </form>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-8">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
      </div>
    </div>
  );
}
