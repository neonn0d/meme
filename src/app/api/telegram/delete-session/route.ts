import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { deleteSessionFromSupabase } from '@/lib/telegram';

export async function POST(req: Request) {
  // Get the authorization header
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Extract the wallet address from the Bearer token
  const walletAddress = authHeader.replace('Bearer ', '');
  
  // Check if Supabase client is available
  if (!supabase) {
    console.error('Supabase client not available');
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }

  // Get the user ID from the wallet address
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const userId = user.id;

  try {
    // Get the phone number from the request
    const { phone } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Delete the session from Supabase's user_private_metadata
    await deleteSessionFromSupabase(userId, phone);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Session deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete session' 
    }, { status: 500 });
  }
}
