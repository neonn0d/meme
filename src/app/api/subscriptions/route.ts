import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/lib/api-auth';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper function to get user ID from wallet address
async function getUserIdFromWallet(walletAddress: string): Promise<string | NextResponse> {
  console.log('Subscriptions API: Looking up user with wallet address:', walletAddress);
  
  try {
    // Try an exact match
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (user) {
      console.log('Subscriptions API: Found user with exact match:', user.id);
      return user.id;
    }
    
    console.error('Subscriptions API: User not found for wallet address:', walletAddress);
    return errorResponse('User not found', 404);
  } catch (error) {
    console.error('Subscriptions API: Error during user lookup:', error);
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
    console.log('Subscriptions API: Using wallet address from Authorization header:', walletAddress);
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
  console.log('Subscriptions API: Using user ID:', userId);

  try {
    console.log('Subscriptions API: Querying subscriptions table for user:', userId);
    
    // Get active subscriptions for the user
    const { data: subscriptions, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (error) {
      console.error('Subscriptions API: Error fetching subscriptions:', error);
      return errorResponse(`Error fetching subscriptions: ${error.message}`, 500);
    }
    
    console.log('Subscriptions API: Found subscriptions:', subscriptions ? subscriptions.length : 0);
    if (subscriptions && subscriptions.length > 0) {
      console.log('Subscriptions API: First subscription:', JSON.stringify(subscriptions[0]));
    } else {
      console.log('Subscriptions API: No active subscriptions found for user');
      
      // Debug: Let's check if there are ANY subscriptions for this user (not just active ones)
      const { data: allSubs, error: allSubsError } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);
        
      if (allSubsError) {
        console.error('Subscriptions API: Error checking all subscriptions:', allSubsError);
      } else {
        console.log('Subscriptions API: Total subscriptions found (any status):', allSubs ? allSubs.length : 0);
        if (allSubs && allSubs.length > 0) {
          console.log('Subscriptions API: First non-active subscription:', JSON.stringify(allSubs[0]));
        }
      }
    }
    
    return NextResponse.json({ subscriptions: subscriptions || [] });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
