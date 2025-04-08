import { NextResponse } from 'next/server';
import { StringSession } from 'telegram/sessions';
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

    const { phone, groupIds, message } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
      return NextResponse.json({ error: 'At least one group ID is required' }, { status: 400 });
    }
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }
    
    // Get session from Supabase
    const session = await getSessionFromSupabase(userId, phone);
    
    // If session not found, return error
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Create a new Telegram client with the session
    const stringSession = new StringSession(session.session);
    const client = new CustomTelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
    
    // Connect to Telegram
    await client.connect();
    
    // Track progress
    let successful = 0;
    let failed = 0;
    
    // Process each group
    for (let i = 0; i < groupIds.length; i++) {
      const groupId = groupIds[i];
      
      try {
        // Get the group entity
        const entity = await client.getEntity(groupId);
        
        // Send the message
        await client.sendMessage(entity, { message: message });
        
        // Increment successful count
        successful++;
      } catch (groupError: any) {
        // Increment failed count
        failed++;
        console.error(`Error sending to group ${groupId}:`, groupError.message);
      }
      
      // Add a small delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Close the client
    await client.disconnect();
    
    // Return simple response with results
    return NextResponse.json({
      status: 'complete',
      progress: {
        current: groupIds.length,
        total: groupIds.length,
        successful,
        failed
      }
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to send message' 
    }, { status: 500 });
  }
}
