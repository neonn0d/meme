"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useUser } from "@clerk/nextjs";
import {
  PaymentRecord,
  Payment,
  SubscriptionStatus,
  calculateSubscriptionStatus,
  formatDate,
} from "@/types/payment";
import { Loader2, RefreshCw, ExternalLink, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface PaymentHistoryRef {
  fetchPayments: () => Promise<void>;
}

const PaymentHistory = forwardRef<PaymentHistoryRef>((_, ref) => {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await fetch("/api/payments");
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      setPayments(data.payments);
      setTotalSpent(data.totalSpent);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payment history");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    fetchPayments,
  }));

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user, fetchPayments]);

  const getExplorerUrl = (hash: string) => {
    return `https://explorer.solana.com/tx/${hash}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-zinc-200">
            <p className="text-zinc-600">
              Please sign in to view payment history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-zinc-200">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-zinc-200">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Map PaymentRecord[] to Payment[] for subscription calculation
  const premiumPayments: Payment[] = payments
    .filter((p) => p.type === "premium")
    .map((p) => ({
      amount: p.amount,
      timestamp: p.timestamp,
      transactionHash: p.transactionHash,
      type: "premium_subscription",
    }));

  const subscriptionStatus = calculateSubscriptionStatus(premiumPayments);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
        {/* Back Button */}
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <h1 className="text-3xl font-bold text-zinc-900">Payment History</h1>
          <p className="mt-2 text-zinc-600">
            View your subscription status and payment history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscription Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 h-max">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>

            {subscriptionStatus ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Status</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      subscriptionStatus.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {subscriptionStatus.isActive ? "Active" : "Expired"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Start Date</span>
                  <span className="font-medium">
                    {formatDate(subscriptionStatus.startDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Expiry Date</span>
                  <span className="font-medium">
                    {formatDate(subscriptionStatus.expiryDate)}
                  </span>
                </div>

                {subscriptionStatus.isActive && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Days Remaining</span>
                    <span className="font-medium">
                      {subscriptionStatus.daysRemaining} days
                    </span>
                  </div>
                )}

                {!subscriptionStatus.isActive && (
                  <button
                    className="w-full mt-4 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                    onClick={() => router.push("/dashboard")}
                  >
                    Renew Subscription
                  </button>
                )}
              </div>
            ) : (
              <p className="text-zinc-600">No active subscription</p>
            )}
          </div>

          {/* Payment History Card */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Payments</h2>
              <button
                onClick={fetchPayments}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            <div className="mb-4 p-3 bg-zinc-50 rounded-lg">
              <span className="text-zinc-600">Total Spent:</span>{" "}
              <span className="font-medium">{totalSpent} SOL</span>
            </div>

            <div className="space-y-4">
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-zinc-900">
                          {payment.amount} SOL
                        </p>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {payment.type}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-zinc-500">
                          {formatDate(payment.timestamp)}
                        </p>
                        <a
                          href={getExplorerUrl(payment.transactionHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors group-hover:text-zinc-600"
                        >
                          <span className="font-mono truncate max-w-[200px]">{payment.transactionHash}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-zinc-600 py-4">
                  No payments found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PaymentHistory.displayName = "PaymentHistory";

export default PaymentHistory;
