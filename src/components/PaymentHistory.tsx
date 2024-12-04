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
  formatDate,
} from "@/types/payment";
import { Loader2, RefreshCw, ExternalLink, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSubscription } from '@/hooks/useSubscription';

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
  const { subscriptionDetails } = useSubscription();

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
            <p className="text-zinc-600">Please sign in to view payment history.</p>
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

  return (
    <div className="min-h-full bg-zinc-50">
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
            {subscriptionDetails ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Status</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    subscriptionDetails.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {subscriptionDetails.isActive ? "Active" : "Expired"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Start Date</span>
                  <span className="font-medium">
                    {formatDate(subscriptionDetails.startDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Expiry Date</span>
                  <span className="font-medium">
                    {formatDate(subscriptionDetails.expiryDate)}
                  </span>
                </div>

                {subscriptionDetails.isActive && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Days Remaining</span>
                    <span className="font-medium">
                      {subscriptionDetails.daysRemaining} days
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-600">No subscription found</p>
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
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
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
                    className="group p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-zinc-900">
                          {payment.amount} SOL
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full capitalize">
                          {payment.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <span>{formatDate(payment.timestamp)}</span>
                        <span>•</span>
                        <a
                          href={getExplorerUrl(payment.transactionHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-zinc-500 hover:text-blue-500 transition-colors"
                        >
                          <span className="hover:underline">View on Explorer</span>
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
