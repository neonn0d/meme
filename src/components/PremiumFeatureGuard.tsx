import { useSubscription } from '@/hooks/useSubscription';
import { formatDate } from '@/types/payment';

interface PremiumFeatureGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PremiumFeatureGuard({
  children,
  fallback
}: PremiumFeatureGuardProps) {
  const { isLoading, error, subscriptionData } = useSubscription();
  const isSubscribed = subscriptionData.isSubscribed;
  const subscriptionDetails = subscriptionData.details;

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto" />
        <p className="mt-2 text-zinc-600">Checking subscription status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-red-600">Unable to verify subscription status</p>
      </div>
    );
  }

  if (!isSubscribed) {
    return fallback || (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-zinc-200">
        <h3 className="text-xl font-semibold mb-4">Premium Feature</h3>
        
        {subscriptionDetails ? (
          <div className="space-y-4">
            <p className="text-zinc-600">
              Your subscription has expired on {formatDate(subscriptionDetails.endDate)}.
            </p>
            <p className="text-zinc-600">
              Renew your subscription to access premium features.
            </p>
            <button
              onClick={() => window.location.href = '/premium'} // Adjust this URL as needed
              className="w-full px-4 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors"
            >
              Renew Subscription
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-zinc-600">
              This feature requires an active premium subscription.
            </p>
            <button
              onClick={() => window.location.href = '/premium'} // Adjust this URL as needed
              className="w-full px-4 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors"
            >
              Get Premium Access
            </button>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
