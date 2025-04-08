import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with admin privileges to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }
    
    console.log('Debugging database for wallet:', walletAddress);
    
    // Step 1: Check if user exists by wallet address
    const { data: users, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress);
    
    if (userError) {
      return NextResponse.json({ error: `Error fetching user: ${userError.message}` }, { status: 500 });
    }
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'No user found with this wallet address' }, { status: 404 });
    }
    
    // Use the first user if multiple exist
    const user = users[0];
    console.log('Found user:', user);
    
    // Step 2: Check if metadata exists
    const { data: metadata, error: metadataError } = await supabaseAdmin
      .from('user_public_metadata')
      .select('*')
      .eq('user_id', user.id);
    
    if (metadataError) {
      return NextResponse.json({ error: `Error fetching metadata: ${metadataError.message}` }, { status: 500 });
    }
    
    // Step 3: Create metadata if it doesn't exist
    let fixResult = null;
    if (!metadata || metadata.length === 0) {
      console.log('No metadata found, creating new record');
      
      const { data: newMetadata, error: insertError } = await supabaseAdmin
        .from('user_public_metadata')
        .insert({
          user_id: user.id,
          payments: [],
          websites: [],
          total_spent: 0,
          total_generated: 0
        })
        .select();
      
      if (insertError) {
        return NextResponse.json({ error: `Error creating metadata: ${insertError.message}` }, { status: 500 });
      }
      
      fixResult = { action: 'created', data: newMetadata };
    } else {
      console.log('Metadata found:', metadata);
      fixResult = { action: 'exists', data: metadata };
    }
    
    // Step 4: Update SolanaPaymentModal to use the correct user ID
    return NextResponse.json({
      success: true,
      user: user,
      metadata: metadata,
      fix: fixResult,
      message: 'Database check complete. Use the user ID in your payment code.'
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: `Unexpected error: ${error.message}` }, { status: 500 });
  }
}
