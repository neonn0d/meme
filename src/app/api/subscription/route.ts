import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import { getSubscriptionStatus } from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  return withAuth(req, handleGetSubscription);
}

async function handleGetSubscription(req: AuthenticatedRequest) {
  try {
    const userId = req.userId;
    
    // Check if supabase client is available
    if (!supabase) {
      console.error('Database connection not available');
      return NextResponse.json({
        status: 'error',
        message: 'Database connection not available'
      }, { status: 500 });
    }
    
    // Get subscription from Supabase
    const { isSubscribed, subscription } = await getSubscriptionStatus(userId);
    
    // Get payment history
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (paymentsError) {
      console.error('Error fetching payment history:', paymentsError);
    }
    
    const lastPayment = payments && payments.length > 0 ? payments[0] : null;

    return NextResponse.json({
      status: 'success',
      data: {
        isSubscribed: isSubscribed,
        subscriptionDetails: subscription ? {
          startDate: subscription.created_at,
          expiryDate: subscription.current_period_end,
          lastPaymentDate: lastPayment?.created_at || null,
          nextBillingDate: subscription.current_period_end,
          planId: subscription.price_id,
          status: subscription.status
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
