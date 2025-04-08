import { NextResponse } from 'next/server';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram';
import { getSessionFromSupabase } from '@/lib/telegram';
import { CustomTelegramClient } from '@/lib/customTelegramClient';
import { supabase } from '@/lib/supabase';

// Load environment variables
const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";

export async function POST(req: Request) {
  try {
    // Get the wallet address from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No valid authorization header' }, { status: 401 });
    }
    
    const walletAddress = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Check if supabase client is available
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    // Get user ID from wallet address
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
      
    if (userError || !userData) {
      return NextResponse.json({ error: 'Unauthorized - User not found' }, { status: 401 });
    }
    
    const userId = userData.id;

    // Validate API credentials
    if (!apiId || !apiHash) {
      return NextResponse.json({ error: 'Telegram API credentials not configured' }, { status: 500 });
    }

    // Get the session info from the request
    const { phone } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Get the session from Supabase
    const sessionData = await getSessionFromSupabase(userId, phone);
    
    if (!sessionData) {
      // If no session in Supabase, check if we need to delete a file
      // No sessionPath is provided in the request, so we cannot delete a file
      return NextResponse.json({ 
        success: true, 
        message: 'Already logged out (no session found)'
      });
    }
    
    // Extract the session string
    if (!sessionData.session || typeof sessionData.session !== 'string') {
      console.error('Invalid session data:', sessionData);
      
      // We're not deleting the session from Supabase anymore, just report the error
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid session data'
      });
    }
    
    const sessionString = sessionData.session;
    console.log('Session string length:', sessionString.length);

    // Create a new Telegram client with the session
    const client = new CustomTelegramClient(
      new StringSession(sessionString),
      apiId,
      apiHash,
      { 
        connectionRetries: 3,
        useWSS: false,
        autoReconnect: false,
        requestRetries: 1,
        timeout: 10000, // 10 seconds timeout
        useIPV6: false
      }
    );

    try {
      // Connect to Telegram
      await client.connect();
      
      // Check if we're actually logged in
      const isLoggedIn = await client.checkAuthorization();
      
      if (!isLoggedIn) {
        console.log('Not logged in, no need to log out');
        
        // Disconnect the client
        await client.disconnect();
        
        // We're not deleting the session from Supabase anymore
        return NextResponse.json({ 
          success: true, 
          message: 'Already logged out (not logged in)'
        });
      }
      
      // Log out from Telegram (this will invalidate the session on Telegram's side)
      await client.invoke(new Api.auth.LogOut());
      
      // Disconnect the client
      await client.disconnect();
      
      // We're not deleting the session from Supabase anymore
      
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully logged out from Telegram'
      });
    } catch (error: any) {
      console.error('Error logging out:', error);
      
      // Try to disconnect the client
      try {
        await client.disconnect();
      } catch (disconnectError) {
        console.error('Error disconnecting client:', disconnectError);
      }
      
      // We're not deleting the session from Supabase anymore
      
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'An error occurred during logout'
      });
    }
  } catch (error: any) {
    console.error('Error processing logout request:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An error occurred'
    }, { status: 500 });
  }
}
