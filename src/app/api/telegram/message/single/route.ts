import { NextResponse } from 'next/server';
import { StringSession } from 'telegram/sessions';
import { getSessionFromSupabase } from '@/lib/telegram';
import { CustomTelegramClient } from '@/lib/customTelegramClient';
import { Api } from 'telegram';
import { supabase, supabaseAdmin } from '@/lib/supabase';

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
    const { phone, groupId, message } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }
    
    // Get session from Supabase
    console.log('Getting session from Supabase for user ID:', userId, 'and phone:', phone);
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
    
    try {
      // Get the group entity
      const entity = await client.getEntity(groupId);
      
      // Get group name/title - safely access properties that might not exist on all entity types
      let groupName = groupId;
      
      // Check if entity has title property (channels and chats have this)
      if ('title' in entity && typeof entity.title === 'string') {
        groupName = entity.title;
      } 
      // Fallback to username if available
      else if ('username' in entity && typeof entity.username === 'string') {
        groupName = entity.username;
      }
      
      // Send the message
      const sentMessage = await client.sendMessage(entity, { message: message });
      
      // Create message URL if possible (for public groups/channels)
      let messageUrl = null;
      if ('username' in entity && typeof entity.username === 'string') {
        // For public groups/channels with username
        const username = entity.username;
        const messageId = sentMessage.id;
        messageUrl = `https://t.me/${username}/${messageId}`;
      }
      
      // Close the client
      await client.disconnect();
      
      // Return success response with detailed info
      return NextResponse.json({
        success: true,
        groupId,
        groupName,
        messageId: sentMessage.id,
        messageUrl,
        timestamp: new Date().toISOString()
      });
    } catch (groupError: any) {
      // Close the client
      await client.disconnect();
      
      // Return error for this specific group
      return NextResponse.json({ 
        error: groupError.message || 'Failed to send message to this group' 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to send message' 
    }, { status: 500 });
  }
}
