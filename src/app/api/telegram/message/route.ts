import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { StringSession } from 'telegram/sessions';
import { getSessionFromClerk } from '@/lib/telegram';
import { CustomTelegramClient } from '@/lib/customTelegramClient';

// Load environment variables
const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";

// Add random variations to a message
function randomizeMessage(message: string): string {
  // Simple randomization - add random emojis or slight text variations
  const emojis = ["🚀", "💰", "🔥", "✨", "💎", "🌙", "🌟"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  // 50% chance to add emoji at the end
  if (Math.random() > 0.5) {
    return `${message} ${randomEmoji}`;
  }
  
  // 30% chance to add emoji at the beginning
  if (Math.random() > 0.7) {
    return `${randomEmoji} ${message}`;
  }
  
  // Otherwise return original
  return message;
}

export async function POST(req: Request) {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { phone, groupIds, message, randomize = false } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
      return NextResponse.json({ error: 'At least one group ID is required' }, { status: 400 });
    }
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }
    
    // Get session from Clerk
    const session = await getSessionFromClerk(userId, phone);
    
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
        
        // Prepare the message text, possibly randomized
        const messageText = randomize ? randomizeMessage(message) : message;
        
        // Send the message
        await client.sendMessage(entity, { message: messageText });
        
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
