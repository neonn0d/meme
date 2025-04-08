export interface PaymentRecord {
  timestamp: number;
  amount: number;
  price?: number;
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
  endDate: number;
  plan: string;
  paymentAmount: number;
  transactionHash: string;
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

// This function is kept for backward compatibility but we're now using the subscription table directly
export const calculateSubscriptionStatus = (payments: Payment[]): SubscriptionStatus | null => {
  if (!payments.length) return null;

  // Sort payments by timestamp in descending order to get the latest
  const sortedPayments = [...payments].sort((a, b) => b.timestamp - a.timestamp);
  const latestPayment = sortedPayments[0];

  const now = Date.now();
  
  // Calculate end date (30 days from payment date)
  const endDate = latestPayment.timestamp + (30 * 24 * 60 * 60 * 1000);
  
  return {
    isActive: now < endDate,
    startDate: latestPayment.timestamp,
    endDate: endDate,
    plan: 'monthly',
    paymentAmount: latestPayment.amount,
    transactionHash: latestPayment.transactionHash
  };
};
