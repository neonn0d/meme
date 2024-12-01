"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { PlusCircle, BookOpen, Zap } from "lucide-react";
import PremiumSubscription from "@/components/premium-subscription";
import PaymentHistory, { PaymentHistoryRef } from "@/components/PaymentHistory";
import { useRef } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { formatDate } from "@/types/payment";
import { Sparkles, Rocket, History, Settings, Link2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { userId } = useAuth();
  const paymentHistoryRef = useRef<PaymentHistoryRef>(null);
  const [hasPayments, setHasPayments] = useState(false);
  const {
    isLoading,
    error,
    isSubscribed,
    subscriptionDetails,
    checkSubscription,
  } = useSubscription();

  const handlePaymentSuccess = () => {
    // Delay the refresh to allow modal to show
    setTimeout(() => {
      paymentHistoryRef.current?.fetchPayments();
      checkSubscription();
    }, 2000); // 2 second delay to ensure modal is visible
  };

  useEffect(() => {
    // Check if there are any payments
    const checkPayments = async () => {
      try {
        const response = await fetch('/api/payments');
        const data = await response.json();
        setHasPayments(data.payments?.length > 0);
      } catch (error) {
        console.error('Failed to check payments:', error);
      }
    };
    checkPayments();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 py-12 space-y-8">
        {/* Header Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <h1 className="text-3xl font-bold text-zinc-900">
            Welcome to Your Dashboard
          </h1>
          <p className="mt-2 text-zinc-600">
            Create and manage your memecoin websites with our easy-to-use tools.
          </p>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Subscription Overview</h2>
            {isSubscribed && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <Sparkles className="w-4 h-4 mr-1" />
                Premium Active
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="animate-pulse h-20 bg-zinc-100 rounded-lg" />
          ) : error ? (
            <p className="text-red-600">Unable to load subscription status</p>
          ) : (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isSubscribed && subscriptionDetails ? (
                  <>
                    <div className="p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      <p className="text-sm text-zinc-600">Subscription Status</p>
                      <p className="text-lg font-medium text-green-600">
                        Premium Active
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      <p className="text-sm text-zinc-600">Subscription Type</p>
                      <p className="text-lg font-medium text-zinc-900">
                        Monthly Plan
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      <p className="text-sm text-zinc-600">Next Payment</p>
                      <p className="text-lg font-medium text-zinc-900">
                        {formatDate(subscriptionDetails.expiryDate)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      <p className="text-sm text-zinc-600">
                        Subscription Status
                      </p>
                      <p className="text-lg font-medium text-yellow-600">
                        {subscriptionDetails === null
                          ? "No Active Subscription"
                          : "Subscription Expired"}
                      </p>
                    </div>
                    <div className="sm:col-span-2 p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      {!isLoading && (
                        <PremiumSubscription
                          onPaymentSuccess={handlePaymentSuccess}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between mt-4">
                {hasPayments && (
                  <Link
                    href="/history"
                    className="inline-flex items-center text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <History className="w-4 h-4 mr-2" />
                    View Payment History
                  </Link>
                )}
                {subscriptionDetails && !subscriptionDetails.isActive && (
                  <div className="inline-flex items-center text-zinc-500">
                    Expired on {formatDate(subscriptionDetails.expiryDate)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/templates"
            className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            <div className="mb-4">
              <PlusCircle className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              Create New Website
            </h2>
            <p className="mb-6 flex-grow text-zinc-600">
              Choose from our professionally designed templates to create your
              memecoin website.
            </p>
            <span className="self-start inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              Browse Templates
            </span>
          </Link>

          <Link
            href="/docs"
            className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            <div className="mb-4">
              <BookOpen className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              Documentation
            </h2>
            <p className="mb-6 flex-grow text-zinc-600">
              Learn how to customize your website and make the most of our
              features.
            </p>
            <span className="self-start inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              View Documentation
            </span>
          </Link>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="mb-4">
              <Zap className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              Quick Start
            </h2>
            <p className="mb-4 text-zinc-600">
              Get started quickly with our step-by-step guide to creating your
              website.
            </p>
            <ol className="text-sm space-y-2 list-decimal list-inside mb-6 flex-grow text-zinc-600">
              <li>Choose a template</li>
              <li>Customize content</li>
              <li>Generate and download</li>
            </ol>
          </div>
        </div>

        {/* Available Templates */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">
            Available Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg border border-zinc-200 hover:shadow-sm transition-all duration-300">
              <h3 className="text-lg font-bold text-zinc-900">
                Modern Template
              </h3>
              <p className="mt-2 text-zinc-600">A sleek and modern design.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-zinc-200 hover:shadow-sm transition-all duration-300">
              <h3 className="text-lg font-bold text-zinc-900">
                Rocket Template
              </h3>
              <p className="mt-2 text-zinc-600">Space-themed design.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
