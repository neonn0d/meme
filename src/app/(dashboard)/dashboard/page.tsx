"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { formatDate } from "@/types/payment";
import { Sparkles, PlusCircle, BookOpen, Zap } from "lucide-react";
import { useState } from "react";
import PremiumSubscription from "@/components/premium-subscription";
import Link from "next/link";

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const {
    isLoading,
    error,
    subscriptionData,
    checkSubscription,
  } = useSubscription();
  
  const isSubscribed = subscriptionData.isSubscribed;
  const subscriptionDetails = subscriptionData.details;

  const handlePaymentSuccess = () => {
    // Delay the refresh to allow modal to show
    setTimeout(() => {
      checkSubscription();
    }, 2000); // 2 second delay to ensure modal is visible
  };

  // No need to check for payments since we removed the payment history component

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 py-6 sm:py-12 space-y-4 sm:space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-zinc-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
            Welcome to Your Dashboard
          </h1>
          <p className="mt-2 text-zinc-600">
            Create and manage your memecoin websites with our easy-to-use tools.
          </p>
        </div>
        {/* Status Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Subscription Status</h2>
            {isSubscribed && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Premium Active
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="animate-pulse h-20 bg-zinc-100 rounded-lg" />
          ) : error ? (
            <div className="space-y-4">
              <p className="text-red-600">Unable to load subscription status: {error}</p>
              <button 
                onClick={() => checkSubscription()} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isSubscribed && subscriptionDetails ? (
                  <>
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      <p className="text-sm text-zinc-600">Subscription Status</p>
                      <p className="text-lg font-medium text-green-600">
                        Premium Active
                      </p>
                    </div>

                    <div className="p-4 sm:p-6 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      <p className="text-sm text-zinc-600">Subscription Type</p>
                      <p className="text-lg font-medium text-zinc-900">
                        Monthly Plan
                      </p>
                    </div>

                    <div className="p-4 sm:p-6 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      <p className="text-sm text-zinc-600">Next Payment</p>
                      <p className="text-lg font-medium text-zinc-900">
                        {formatDate(subscriptionDetails.endDate)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      <p className="text-sm text-zinc-600">
                        Subscription Status
                      </p>
                      <p className="text-lg font-medium text-yellow-600">
                        {subscriptionDetails === null
                          ? "No Active Subscription"
                          : "Subscription Expired"}
                      </p>
                    </div>
                    <div className="sm:col-span-2 p-3 sm:p-4 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl border border-zinc-200">
                      {!isLoading && (
                        <PremiumSubscription
                          onPaymentSuccess={handlePaymentSuccess}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
              {subscriptionDetails && !subscriptionDetails.isActive && (
                <div className="inline-flex items-center text-zinc-500 mt-4">
                  Expired on {formatDate(subscriptionDetails.endDate)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/templates"
            className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            <div className="mb-4">
              <PlusCircle className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
              Create New Website
            </h2>
            <p className="mb-6 flex-grow text-zinc-600">
              Choose from our professionally designed templates to create your
              memecoin website.
            </p>
            <span className="self-start inline-flex items-center px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              Browse Templates
            </span>
          </Link>

          <Link
            href="/docs"
            className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            <div className="mb-4">
              <BookOpen className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
              Documentation
            </h2>
            <p className="mb-6 flex-grow text-zinc-600">
              Learn how to customize your website and make the most of our
              features.
            </p>
            <span className="self-start inline-flex items-center px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              View Documentation
            </span>
          </Link>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="mb-4">
              <Zap className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
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
      </div>
    </div>
  );
}
