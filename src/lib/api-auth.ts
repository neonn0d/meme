import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';

// Custom error response helper
export function errorResponse(message: string, status = 401) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

// Get the user ID from the authorization header containing wallet address
export async function getUserId(req: NextRequest) {
  // Check for wallet address in the request
  const authHeader = req.headers.get('authorization');
  let walletAddress: string | null = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract wallet address from Bearer token
    walletAddress = authHeader.substring(7);
    console.log('API Auth: Using wallet address from Authorization header:', walletAddress);
  }
  
  if (!walletAddress) {
    return null;
  }
  
  // Look up user by wallet address
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (error || !user) {
    return null;
  }
  
  return user.id;
}

// Middleware to require authentication
export async function requireAuth(req: NextRequest) {
  const userId = await getUserId(req);
  
  if (!userId) {
    return {
      success: false,
      response: errorResponse('Unauthorized. Please connect your wallet and try again.')
    };
  }
  
  return {
    success: true,
    userId
  };
}
