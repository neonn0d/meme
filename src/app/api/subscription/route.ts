import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs';
import { calculateSubscriptionStatus } from '@/types/payment';

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Authentication required',
          data: { isSubscribed: false, subscriptionDetails: null }
        },
        { status: 401 }
      );
    }

    const user = await clerkClient.users.getUser(userId);
    const privateMetadata = user.privateMetadata as { payments?: any[] } || {};
    const payments = privateMetadata.payments || [];

    const subscriptionStatus = calculateSubscriptionStatus(payments);
    const lastPayment = payments[payments.length - 1];

    return NextResponse.json({
      status: 'success',
      data: {
        isSubscribed: subscriptionStatus?.isActive || false,
        subscriptionDetails: subscriptionStatus ? {
          ...subscriptionStatus,
          lastPaymentDate: lastPayment?.date || null,
          nextBillingDate: subscriptionStatus.expiryDate,
        } : null,
      }
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Failed to fetch subscription status',
        data: { isSubscribed: false, subscriptionDetails: null }
      },
      { status: 500 }
    );
  }
}
