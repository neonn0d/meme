import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { StringSession } from 'telegram/sessions';
import fs from 'fs';
import path from 'path';
import { Api } from 'telegram';
import { getSessionFromClerk } from '@/lib/telegram';
import { CustomTelegramClient } from '@/lib/customTelegramClient';

// Load environment variables
const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";

export async function POST(req: Request) {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate API credentials
  if (!apiId || !apiHash) {
    return NextResponse.json({ error: 'Telegram API credentials not configured' }, { status: 500 });
  }

  try {
    // Get the session info from the request
    const { phone } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // First, try to get the session from Clerk
    const sessionData = await getSessionFromClerk(userId, phone);
    
    if (!sessionData) {
      // If no session in Clerk, check if we need to delete a file
      // No sessionPath is provided in the request, so we cannot delete a file
      return NextResponse.json({ 
        success: true, 
        message: 'Already logged out (no session found)'
      });
    }
    
    // Extract the session string
    if (!sessionData.session || typeof sessionData.session !== 'string') {
      console.error('Invalid session data:', sessionData);
      
      // We're not deleting the session from Clerk anymore, just report the error
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
        
        // We're not deleting the session from Clerk anymore
        return NextResponse.json({ 
          success: true, 
          message: 'Already logged out (not logged in)'
        });
      }
      
      // Log out from Telegram (this will invalidate the session on Telegram's side)
      await client.invoke(new Api.auth.LogOut());
      
      // Disconnect the client
      await client.disconnect();
      
      // We're not deleting the session from Clerk anymore
      
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
      
      // We're not deleting the session from Clerk anymore
      
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
