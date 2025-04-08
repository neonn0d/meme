import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, parseSignature } from '@/lib/auth-utils';
import { PublicKey } from '@solana/web3.js';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, signature, message } = await req.json();
    
    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Convert wallet address to public key
    const publicKey = new PublicKey(walletAddress);
    
    // Parse signature from base58
    const parsedSignature = parseSignature(signature);
    
    // Convert message to Uint8Array
    const messageBytes = new TextEncoder().encode(message);
    
    // Verify signature
    const isValid = verifySignature(
      messageBytes,
      parsedSignature,
      publicKey.toBytes()
    );
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Check if supabase client is available
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }
    
    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (userError || !user) {
      console.error('Error finding user:', userError);
      
      // Create user if not found
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          verified: true
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
      
      // Initialize metadata tables for new user
      await supabase
        .from('user_public_metadata')
        .insert({
          user_id: newUser.id,
          websites: [],
          total_generated: 0,
          total_spent: 0,
          payments: []
        });
      
      await supabase
        .from('user_private_metadata')
        .insert({
          user_id: newUser.id,
          telegram_sessions: []
        });
      
      return NextResponse.json({
        success: true,
        verified: true,
        user: newUser
      });
    }
    
    // Update user verification status
    const { error: updateError } = await supabase
      .from('users')
      .update({ verified: true })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('Error updating user verification status:', updateError);
    }
    
    return NextResponse.json({
      success: true,
      verified: true,
      user
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { error: 'Failed to verify signature' },
      { status: 500 }
    );
  }
}
