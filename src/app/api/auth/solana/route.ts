import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with admin privileges to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Only create the client if we have valid credentials
const supabaseAdmin = (supabaseUrl && supabaseServiceRoleKey) ? 
  createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }) : null;

export async function POST(request: Request) {
  console.log('Solana auth API called');
  
  try {
    const body = await request.text();
    console.log('API: Request body:', body);
    
    let walletAddress;
    try {
      const parsedBody = JSON.parse(body);
      walletAddress = parsedBody.walletAddress;
      console.log('API: Parsed wallet address:', walletAddress);
    } catch (parseError) {
      console.error('API: Error parsing request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    if (!walletAddress) {
      console.log('API: No wallet address provided');
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }
    
    console.log('API: Checking if user exists with wallet:', walletAddress);
    console.log('API: Using Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('API: Service role key available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.error('API: Supabase admin client not available');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    // Check if user exists
    const { data: existingUser, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('API: Error checking for existing user:', queryError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    if (existingUser) {
      console.log('API: User exists:', existingUser.id);
      
      // Create response with user data - no cookies, just return the user object
      console.log('API: Returning existing user data without setting cookies');
      return NextResponse.json({ user: existingUser });
    }
    
    // Create new user
    console.log('API: Creating new user with wallet:', walletAddress);
    
    // Check if Supabase admin client is available (double check)
    if (!supabaseAdmin) {
      console.error('API: Supabase admin client not available');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        wallet_address: walletAddress,
      })
      .select()
      .single();
    
    if (createError) {
      console.error('API: Error creating user:', createError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    console.log('API: New user created:', newUser.id);
    
    // Initialize metadata tables
    try {
      // Check if Supabase admin client is available (double check)
      if (!supabaseAdmin) {
        console.error('API: Supabase admin client not available');
        // Continue anyway since we already created the user
      } else {
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
      }
      
      console.log('API: User metadata initialized');
    } catch (metadataError) {
      console.error('API: Error initializing metadata:', metadataError);
      // Continue even if metadata initialization fails
    }
    
    // Create response with user data - no cookies, just return the user object
    console.log('API: Returning new user data without setting cookies');
    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('API: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
