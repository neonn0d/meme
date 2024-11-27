export interface PaymentRecord {
  timestamp: number;
  amount: number;
  transactionHash: string;
  type: 'premium' | 'website' | 'setup';
  status: 'confirmed' | 'completed';
  network: string;
}

export interface UserPaymentMetadata {
  payments: PaymentRecord[];
  totalSpent: number;
}

export interface Payment {
  amount: number;
  timestamp: number;
  transactionHash: string;
  type: 'premium_subscription';
}

export interface SubscriptionStatus {
  isActive: boolean;
  startDate: number;
  expiryDate: number;
  daysRemaining: number;
}

export interface UserSubscriptionData {
  payments: Payment[];
  totalSpent: number;
  currentSubscription: SubscriptionStatus | null;
}

export const calculateSubscriptionStatus = (payments: Payment[]): SubscriptionStatus | null => {
  if (!payments.length) return null;

  // Sort payments by timestamp in descending order
  const sortedPayments = [...payments].sort((a, b) => b.timestamp - a.timestamp);
  const latestPayment = sortedPayments[0];

  const startDate = latestPayment.timestamp;
  const expiryDate = startDate + (30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
  const now = Date.now();
  const daysRemaining = Math.max(0, Math.ceil((expiryDate - now) / (24 * 60 * 60 * 1000)));
  
  return {
    isActive: now < expiryDate,
    startDate,
    expiryDate,
    daysRemaining
  };
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
