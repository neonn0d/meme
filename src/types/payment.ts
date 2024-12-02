export interface PaymentRecord {
  timestamp: number;
  amount: number;
  transactionHash: string;
  type: 'premium' | 'website' | 'setup';
  status: 'confirmed' | 'completed';
  network: string;
  expiryDate: number;
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
  expiryDate: number; // Add expiryDate to Payment interface
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

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const calculateSubscriptionStatus = (payments: Payment[]): SubscriptionStatus | null => {
  if (!payments.length) return null;

  // Sort payments by timestamp in descending order to get the latest
  const sortedPayments = [...payments].sort((a, b) => b.timestamp - a.timestamp);
  const latestPayment = sortedPayments[0];

  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  
  // Use the stored expiry date
  const daysRemaining = Math.max(0, Math.ceil((latestPayment.expiryDate - now) / msPerDay));
  
  return {
    isActive: now < latestPayment.expiryDate,
    startDate: latestPayment.timestamp,
    expiryDate: latestPayment.expiryDate,
    daysRemaining
  };
};
