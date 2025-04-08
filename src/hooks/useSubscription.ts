import { useState, useEffect } from 'react';
import { SubscriptionStatus, calculateSubscriptionStatus, PaymentRecord, Payment } from '@/types/payment';
import { useAuth } from '@/contexts/AuthContext';

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  payment_info?: {
    amount: number;
    transactionHash: string;
    network: string;
  };
}

interface SubscriptionResponse {
  subscriptions: Subscription[];
}

export function useSubscription() {
  const { userProfile, isLoading: authLoading } = useAuth();
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
      // Don't try to fetch if we're still loading auth or don't have a user profile
      if (authLoading || !userProfile) {
        console.log('Auth still loading or no user profile, skipping subscription check');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      // Get wallet address from user profile
      const walletAddress = userProfile.wallet_address;
      
      if (!walletAddress) {
        console.error('User profile exists but no wallet address found');
        setError('No wallet address available');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching subscription data with wallet:', walletAddress);
      
      const response = await fetch('/api/subscriptions', {
        headers: {
          'Authorization': `Bearer ${walletAddress}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.error('Subscription API error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error(`Failed to fetch subscription data: ${response.status} ${response.statusText}`);
      }

      const data: SubscriptionResponse = await response.json();
      console.log('Subscription data received:', data);
      
      const subscriptions = data.subscriptions || [];
      console.log('Subscriptions array:', subscriptions);
      
      // Check if there's an active subscription
      const activeSubscription = subscriptions.find(sub => sub.status === 'active');
      console.log('Active subscription:', activeSubscription);
      
      if (activeSubscription) {
        // Create subscription status from the active subscription
        const endDate = new Date(activeSubscription.current_period_end).getTime();
        const startDate = new Date(activeSubscription.current_period_start).getTime();
        const now = Date.now();
        
        const subscriptionStatus: SubscriptionStatus = {
          isActive: now < endDate,
          startDate: startDate,
          endDate: endDate,
          plan: activeSubscription.plan,
          paymentAmount: activeSubscription.payment_info?.amount || 0,
          transactionHash: activeSubscription.payment_info?.transactionHash || ''
        };
        
        setSubscriptionData({
          isSubscribed: true,
          details: subscriptionStatus,
        });
      } else {
        setSubscriptionData({
          isSubscribed: false,
          details: null,
        });
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only run this effect when authentication is complete
    if (authLoading) {
      console.log('Auth is still loading, waiting to check subscription');
      return;
    }
    
    if (!userProfile) {
      console.log('No user profile available after auth completed');
      setIsLoading(false); // Stop loading if there's no profile
      return;
    }
    
    console.log('Auth complete and user profile available, checking subscription');
    checkSubscription();
  }, [userProfile, authLoading]);

  return {
    isLoading: isLoading || authLoading, // Consider auth loading as part of subscription loading
    error,
    subscriptionData: {
      isSubscribed: subscriptionData.isSubscribed,
      details: subscriptionData.details,
    },
    checkSubscription,
  };
}
