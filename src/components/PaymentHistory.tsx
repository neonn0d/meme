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
import { Loader2, ExternalLink, ArrowLeft, Code2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSubscription } from '@/hooks/useSubscription';
import { WebsiteGeneration } from "@/types/website-generation";

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
  const { subscriptionDetails } = useSubscription();
  const [websites, setWebsites] = useState<WebsiteGeneration[]>([]);
  const [totalGenerated, setTotalGenerated] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      // Fetch payments
      const paymentsResponse = await fetch("/api/payments");
      if (!paymentsResponse.ok) {
        throw new Error("Failed to fetch payments");
      }
      const paymentsData = await paymentsResponse.json();
      setPayments(paymentsData.payments);
      setTotalSpent(paymentsData.totalSpent);

      // Fetch websites
      const websitesResponse = await fetch("/api/websites");
      if (!websitesResponse.ok) {
        throw new Error("Failed to fetch websites");
      }
      const websitesData = await websitesResponse.json();
      setWebsites(websitesData.websites);
      setTotalGenerated(websitesData.totalGenerated);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    fetchPayments: fetchData,
  }));

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const getExplorerUrl = (hash: string) => {
    return `https://explorer.solana.com/tx/${hash}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-zinc-200">
            <p className="text-zinc-600">Please sign in to view history.</p>
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
          <h1 className="text-3xl font-bold text-zinc-900">Account History</h1>
          <p className="mt-2 text-zinc-600">
          Track your premium features, payments, and website generations.
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-zinc-900">Subscription Status</h2>
            {subscriptionDetails?.isActive && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                Active Premium
              </span>
            )}
          </div>
          {subscriptionDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-zinc-50/50 rounded-xl p-4 border border-zinc-100">
                <span className="text-zinc-500 text-sm block mb-1">Status</span>
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  subscriptionDetails.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {subscriptionDetails.isActive ? "Active" : "Expired"}
                </div>
              </div>

              <div className="bg-zinc-50/50 rounded-xl p-4 border border-zinc-100">
                <span className="text-zinc-500 text-sm block mb-1">Start Date</span>
                <div className="font-medium text-zinc-900">
                  {formatDate(subscriptionDetails.startDate)}
                </div>
              </div>

              <div className="bg-zinc-50/50 rounded-xl p-4 border border-zinc-100">
                <span className="text-zinc-500 text-sm block mb-1">Expiry Date</span>
                <div className="font-medium text-zinc-900">
                  {formatDate(subscriptionDetails.expiryDate)}
                </div>
              </div>

              <div className="bg-zinc-50/50 rounded-xl p-4 border border-zinc-100">
                <span className="text-zinc-500 text-sm block mb-1">Days Remaining</span>
                <div className="font-medium text-zinc-900">
                  {subscriptionDetails.daysRemaining} days
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 rounded-xl p-6 text-center">
              <p className="text-zinc-600">No subscription found</p>
              <Link 
                href="/pricing" 
                className="inline-flex items-center mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View Premium Plans
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Payment and Website Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment History Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-2">Payment History</h2>
                <p className="text-sm text-zinc-500">View your payment history and website generations</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {payments.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-xl">
                  <p className="text-zinc-500">No payments yet</p>
                </div>
              ) : (
                payments.map((payment, index) => (
                  <div
                    key={payment.transactionHash || index}
                    className="group p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-zinc-900">
                            {payment.type === 'premium' ? "Premium Subscription" : `${payment.amount} SOL`}
                          </p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            payment.type === 'premium' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {payment.type === 'premium' ? 'Premium' : 'Website'}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500">
                          {formatDate(payment.timestamp)}
                        </p>
                      </div>
                      {payment.transactionHash && (
                        <button
                          onClick={() => window.open(getExplorerUrl(payment.transactionHash!), '_blank')}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-300 transition-colors gap-1.5"
                        >
                          View
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Website Generation History Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-semibold text-zinc-900">Generated Websites</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {totalGenerated} Total Generated
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {websites.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-xl">
                  <p className="text-zinc-500">No websites generated yet</p>
                </div>
              ) : (
                websites.map((website, index) => (
                  <div
                    key={website.transactionHash || index}
                    className="p-4 bg-white rounded-xl border border-zinc-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-zinc-900">
                            {website.price ? `${website.price} SOL` : 'Premium Generation'}
                          </p>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            website.price 
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {website.price ? 'Website' : 'Premium'}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500">
                          {formatDate(new Date(website.timestamp).getTime())}
                        </p>
                      </div>
                      {(website.hash || website.transactionHash) && (
                        <button
                          onClick={() => window.open(getExplorerUrl(website.hash || website.transactionHash!), '_blank')}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-300 transition-colors gap-1.5"
                        >
                          View
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
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
