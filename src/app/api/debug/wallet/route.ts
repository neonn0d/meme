import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  // Get the authorization header
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Extract the wallet address from the Bearer token
  const walletAddress = authHeader.replace('Bearer ', '');
  
  // Check if Supabase client is available
  if (!supabase) {
    console.error('Debug API: Supabase client not available');
    return NextResponse.json({ 
      error: 'Database connection error',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
    }, { status: 500 });
  }

  // Debug information
  const debugInfo = {
    walletAddress,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set',
    supabaseClientAvailable: !!supabase,
    supabaseAdminAvailable: !!supabaseAdmin
  };

  // Get the user ID from the wallet address
  console.log('Debug API: Looking up user with wallet address:', walletAddress);
  
  // Use filter instead of eq to avoid potential format issues
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .filter('wallet_address', 'eq', walletAddress);
  
  // Find the matching user
  const user = users && users.length > 0 ? users[0] : null;
  
  return NextResponse.json({ 
    debugInfo,
    userFound: !!user,
    user: user,
    userError: userError ? userError.message : null,
    usersCount: users ? users.length : 0
  });
}
