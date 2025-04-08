import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, errorResponse } from '@/lib/api-auth';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  
  if (!authResult.success) {
    return authResult.response;
  }
  
  const userId = authResult.userId;

  try {
    // Check if supabase client is available
    if (!supabase) {
      console.error('Database connection not available');
      return errorResponse('Database connection not available', 500);
    }
    
    // Get user's public metadata from Supabase
    const { data: userData, error } = await supabase
      .from('user_public_metadata')
      .select('payments')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      return errorResponse('Error fetching user data', 500);
    }
    
    if (!userData) {
      return errorResponse('User not found', 404);
    }

    // Get payments from user metadata
    const payments = userData.payments || [];
    
    // Find active premium subscription
    const now = Date.now();
    const activePremium = payments.find((payment: any) => 
      payment.type === 'premium' && 
      payment.status === 'completed' && 
      payment.expiryDate > now
    );

    return NextResponse.json({
      isSubscribed: !!activePremium,
      // Include additional subscription details if needed
      subscription: activePremium ? {
        expiryDate: activePremium.expiryDate,
        purchaseDate: activePremium.timestamp,
        amount: activePremium.amount
      } : null
    });
  } catch (error: any) {
    console.error('Error checking subscription:', error);
    return errorResponse(error.message || 'Failed to check subscription status', 500);
  }
}
