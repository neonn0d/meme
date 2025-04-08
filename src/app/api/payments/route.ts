import { NextRequest, NextResponse } from 'next/server';
import { PaymentRecord } from '@/types/payment';
import { errorResponse } from '@/lib/api-auth';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper function to get or create a user ID from wallet address
async function getUserIdFromWallet(walletAddress: string): Promise<string | NextResponse> {
  console.log('Payments API: Looking up user with wallet address:', walletAddress);
  
  try {
    // First try an exact match
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (user) {
      console.log('Payments API: Found user with exact match:', user.id);
      return user.id;
    }
    
    // If exact match fails, try case-insensitive match
    console.log('Payments API: Exact match failed, trying case-insensitive match');
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, wallet_address')
      .ilike('wallet_address', walletAddress);
    
    if (usersError) {
      console.error('Payments API: Error in case-insensitive search:', usersError);
    } else if (users && users.length > 0) {
      console.log('Payments API: Found user with case-insensitive match:', users[0].id);
      console.log('Payments API: Stored wallet:', users[0].wallet_address, 'vs Provided wallet:', walletAddress);
      return users[0].id;
    }
    
    // If no user found, check if we need to create one
    console.log('Payments API: No user found, creating new user');
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        wallet_address: walletAddress,
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Payments API: Error creating user:', createError);
      return errorResponse('Failed to create user account', 500);
    }
    
    if (newUser) {
      console.log('Payments API: Created new user:', newUser.id);
      
      // Initialize metadata tables
      await supabaseAdmin
        .from('user_public_metadata')
        .insert({
          user_id: newUser.id,
          websites: [],
          total_generated: 0,
          total_spent: 0,
          payments: []
        });
      
      await supabaseAdmin
        .from('user_private_metadata')
        .insert({
          user_id: newUser.id,
          telegram_sessions: []
        });
      
      return newUser.id;
    }
    
    console.error('Payments API: Failed to find or create user');
    return errorResponse('User not found and could not be created', 500);
  } catch (error) {
    console.error('Payments API: Unexpected error during user lookup:', error);
    return errorResponse('Error processing user authentication', 500);
  }
}

export async function GET(req: NextRequest) {
  // Get authentication from the Authorization header
  const authHeader = req.headers.get('authorization');
  let walletAddress: string | null = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract wallet address from Bearer token
    walletAddress = authHeader.substring(7);
    console.log('Payments API: Using wallet address from Authorization header:', walletAddress);
  }
  
  if (!walletAddress) {
    return errorResponse('Unauthorized. Please connect your wallet and try again.');
  }
  
  // Get user ID from wallet address
  const userIdResult = await getUserIdFromWallet(walletAddress);
  
  // If userIdResult is a Response, it means there was an error
  if (userIdResult instanceof NextResponse) {
    return userIdResult;
  }
  
  const userId = userIdResult;
  console.log('Payments API: Using user ID:', userId);

  try {
    // Get payments from user_public_metadata table
    const { data, error } = await supabaseAdmin
      .from('user_public_metadata')
      .select('payments, total_spent')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching payment history:', error);
      return errorResponse('Error fetching payment history', 500);
    }
    
    const payments = data?.payments || [];
    const totalSpent = data?.total_spent || 0;
    
    return NextResponse.json({
      payments,
      totalSpent
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function POST(req: NextRequest) {
  // Get authentication from the Authorization header
  const authHeader = req.headers.get('authorization');
  let walletAddress: string | null = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract wallet address from Bearer token
    walletAddress = authHeader.substring(7);
    console.log('Payments API: Using wallet address from Authorization header:', walletAddress);
  }
  
  if (!walletAddress) {
    return errorResponse('Unauthorized. Please connect your wallet and try again.');
  }
  
  const userIdResult = await getUserIdFromWallet(walletAddress);
  
  // If userIdResult is a Response, it means there was an error
  if (userIdResult instanceof NextResponse) {
    return userIdResult;
  }
  
  const userId = userIdResult;
  console.log('Payments API: Using user ID:', userId);
  
  try {
    const { payment } = await req.json();
    
    // Calculate subscription period (1 month from now)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    
    console.log('Creating subscription record for user:', userId);
    console.log('Subscription period:', startDate, 'to', endDate);
    
    // Create subscription record in the subscriptions table
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        status: 'active',
        plan: 'monthly',
        current_period_start: startDate,
        current_period_end: endDate,
        created_at: new Date(),
        updated_at: new Date(),
        payment_info: payment // Store payment details in the jsonb field
      })
      .select()
      .single();
    
    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      return errorResponse('Error creating subscription', 500);
    }
    
    // Also update user_public_metadata to track total spent (optional)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('user_public_metadata')
      .select('total_spent')
      .eq('user_id', userId)
      .single();
    
    if (!userError) {
      const currentTotalSpent = userData?.total_spent || 0;
      const newTotalSpent = currentTotalSpent + payment.amount;
      
      await supabaseAdmin
        .from('user_public_metadata')
        .update({
          total_spent: newTotalSpent
        })
        .eq('user_id', userId);
    }
    
    console.log('Subscription created successfully:', subscription);
    
    return NextResponse.json({
      success: true,
      subscription: subscription
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
