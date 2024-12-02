import { useState, useEffect } from 'react';
import { SubscriptionStatus, calculateSubscriptionStatus, PaymentRecord, Payment } from '@/types/payment';

interface SubscriptionResponse {
  payments: PaymentRecord[];
}

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<{
    isSubscribed: boolean;
    details: SubscriptionStatus | null;
  }>({
    isSubscribed: false,
    details: null,
  });

  const checkSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data: SubscriptionResponse = await response.json();
      const paymentRecords = data.payments;
      
      // Filter and map premium payments to match Payment type
      const premiumPayments: Payment[] = paymentRecords
        .filter(record => record.type === 'premium')
        .map(record => ({
          amount: record.amount,
          timestamp: record.timestamp,
          transactionHash: record.transactionHash,
          type: 'premium_subscription',
          expiryDate: record.expiryDate
        }));

      const subscriptionStatus = calculateSubscriptionStatus(premiumPayments);
      
      setSubscriptionData({
        isSubscribed: subscriptionStatus?.isActive || false,
        details: subscriptionStatus,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return {
    isLoading,
    error,
    isSubscribed: subscriptionData.isSubscribed,
    subscriptionDetails: subscriptionData.details,
    checkSubscription, // Expose this to allow manual refresh
  };
}
