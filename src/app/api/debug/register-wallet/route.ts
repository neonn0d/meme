import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, userId } = body;
    
    if (!walletAddress || !userId) {
      return NextResponse.json({ 
        error: 'Both walletAddress and userId are required' 
      }, { status: 400 });
    }
    
    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.error('Register API: Supabase admin client not available');
      return NextResponse.json({ 
        error: 'Database connection error',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
      }, { status: 500 });
    }
    
    // Update the user record with the wallet address
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ wallet_address: walletAddress })
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('Register API: Error updating user:', error);
      return NextResponse.json({ 
        error: 'Failed to update user',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Wallet address registered successfully',
      user: data && data.length > 0 ? data[0] : null
    });
  } catch (error: any) {
    console.error('Register API: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error',
      details: error.message
    }, { status: 500 });
  }
}
