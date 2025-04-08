'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumSubPricing } from "@/components/PremiumSubPricing";

const features = [
  {
    name: 'Payment Model',
    standard: `${process.env.NEXT_PUBLIC_SOLANA_PRICE || "0.5"} SOL per website`,
    premium: 'Unlimited websites',
  },
  {
    name: 'Save Money',
    standard: 'Pay full price each time',
    premium: 'Save up to 80% on websites',
  },
  {
    name: 'Generation Speed',
    standard: 'Standard queue',
    premium: 'Priority generation',
  },
  {
    name: 'Telegram Marketing',
    standard: 'Limited (max 3 messages)',
    premium: 'Unlimited messaging',
  },
  {
    name: 'Beta Features',
    standard: 'Not included',
    premium: 'Early access to new features',
  }
];

export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const { isSubscribed } = useSubscription();
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const premiumPrice = process.env.NEXT_PUBLIC_PREMIUM_AMOUNT || "2.5";
  const standardPrice = process.env.NEXT_PUBLIC_SOLANA_PRICE || "0.5";

  const handleUpgradeClick = () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-32">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Upgrade to Premium</h1>
          <p className="mt-2 text-zinc-600">Save money and get priority access to upcoming features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Standard Plan */}
          <div className="bg-white p-6 rounded-xl border border-zinc-200">
            <h3 className="text-xl font-semibold text-zinc-900">Pay As You Go</h3>
            <p className="mt-2 text-zinc-600">Pay full price for each website</p>
            <p className="mt-4">
              <span className="text-2xl font-bold text-zinc-900">{standardPrice}</span>
              <span className="text-zinc-500"> SOL</span>
              <span className="text-zinc-500"> per website</span>
            </p>
          </div>

          {/* Premium Plan */}
          <div className="bg-white p-6 rounded-xl border-2 border-black relative">
            <div className="absolute -top-3 -right-3 bg-black text-white px-3 py-1 text-sm font-medium rounded-full">
              Premium Benefits
            </div>
            <h3 className="text-xl font-semibold text-zinc-900">Premium Access</h3>
            <p className="mt-2 text-zinc-600">Create unlimited websites with premium perks</p>
            <p className="mt-4">
              <span className="text-2xl font-bold text-zinc-900">{premiumPrice}</span>
              <span className="text-zinc-500"> SOL</span>
              <span className="text-zinc-500">/Month</span>
            </p>
            {isSubscribed ? (
              <div className="mt-4 py-2 px-4 bg-zinc-100 text-zinc-900 rounded-lg text-center text-sm">
                You're already a premium member! 
              </div>
            ) : (
              <button
                onClick={handleUpgradeClick}
                className="mt-4 w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200">
            <h3 className="text-lg font-semibold text-zinc-900">Plan Features</h3>
          </div>
          <div className="divide-y divide-zinc-200">
            {features.map((feature) => (
              <div key={feature.name} className="grid grid-cols-3 px-6 py-4">
                <div className="text-sm text-zinc-900">{feature.name}</div>
                <div className="text-sm text-zinc-600">
                  {feature.standard}
                </div>
                <div className="text-sm font-medium text-zinc-900">
                  {feature.premium}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showPaymentModal && (
          <PremiumSubPricing
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPaymentModal(false)}
          />
        )}
      </div>
    </div>
  );
}
