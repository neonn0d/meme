import { NextResponse } from 'next/server';
import { StringSession } from 'telegram/sessions';
import { getSessionFromSupabase } from '@/lib/telegram';
import { CustomTelegramClient } from '@/lib/customTelegramClient';
import { supabase } from '@/lib/supabase';

// Load environment variables
const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";

export async function POST(req: Request) {
  // Get the authorization header
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Extract the token from the Bearer token
  const token = authHeader.replace('Bearer ', '');
  console.log('API: Received token:', token);
  
  // Hardcoded user ID for testing
  const userId = '507d1b70-0089-4823-bcb8-b0ac40faca16';
  console.log('API: Using hardcoded user ID for testing:', userId);

  try {
    const { phone, groupIds, message } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
      return NextResponse.json({ error: 'At least one group ID is required' }, { status: 400 });
    }
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Get session from Supabase
    console.log('Getting session from Supabase for user ID:', userId, 'and phone:', phone);
    const session = await getSessionFromSupabase(userId, phone);
    
    // If session not found, return error
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    console.log('Session found:', session.phone);
    
    // Create a new Telegram client with the session
    const client = new CustomTelegramClient(
      new StringSession(session.session),
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
      
      // Check if the client is connected
      if (!client.connected) {
        await client.disconnect();
        return NextResponse.json({ error: 'Failed to connect to Telegram' }, { status: 500 });
      }
      
      // Send message to each group
      const results = [];
      
      for (const groupId of groupIds) {
        try {
          // Send message to the group
          const result = await client.sendMessage(groupId, { message });
          
          results.push({
            groupId,
            success: true,
            messageId: result.id
          });
        } catch (sendError: any) {
          console.error(`Error sending message to group ${groupId}:`, sendError);
          
          results.push({
            groupId,
            success: false,
            error: sendError.message
          });
        }
      }
      
      // Disconnect from Telegram
      await client.disconnect();
      
      return NextResponse.json({
        success: true,
        results
      });
    } catch (clientError: any) {
      console.error('Error with Telegram client:', clientError);
      
      // Make sure to disconnect the client
      try {
        await client.disconnect();
      } catch (disconnectError) {
        console.error('Error disconnecting client:', disconnectError);
      }
      
      return NextResponse.json({ error: `Telegram client error: ${clientError.message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in send-message API:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
