import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { encryptSessionInfo } from '@/lib/telegram';
import { Api } from 'telegram';

// Load environment variables
const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";

// Validate API credentials
if (!apiId || !apiHash) {
  console.error("Missing Telegram API credentials. Please set TELEGRAM_API_ID and TELEGRAM_API_HASH in .env file.");
}

export async function POST(req: Request) {
  console.log('Telegram login API called');
  
  // For this API, we'll skip authentication since the Telegram API itself
  // will provide security through the verification code process
  // This allows users to start the Telegram login process without being authenticated
  // The actual account linking will happen after verification
  
  try {
    const { phoneNumber, userId } = await req.json();
    
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    // Log the userId if available
    if (userId) {
      console.log(`Telegram login initiated for user ID: ${userId}`);
    } else {
      console.log('Telegram login initiated without user ID');
    }

    // Validate API credentials
    if (!apiId || !apiHash) {
      return NextResponse.json({ error: 'Telegram API credentials not configured' }, { status: 500 });
    }

    // Create a new Telegram client with an empty string session
    const stringSession = new StringSession("");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 3,
    });

    // Connect to Telegram
    await client.connect();

    // Start the phone number verification process using a different approach
    // We'll use the invoke method directly with the auth.sendCode request
    const result = await client.invoke(
      new Api.auth.SendCode({
        phoneNumber,
        apiId,
        apiHash,
        settings: new Api.CodeSettings({
          allowFlashcall: false,
          currentNumber: true,
          allowAppHash: true,
        })
      })
    );

    // Disconnect the client for now
    await client.disconnect();

    // Extract the phone code hash from the result
    // The result is of type SentCode which has a phoneCodeHash property
    const phoneCodeHash = (result as any).phoneCodeHash || '';

    // Create a session info object to be passed back to the client
    // This will be used in subsequent API calls
    const sessionInfo = {
      phoneNumber,
      phoneCodeHash,
      stringSession: stringSession.save(),
    };

    // Encrypt the session info before sending it to the client
    const encryptedSessionInfo = encryptSessionInfo(sessionInfo);

    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent',
      sessionInfo: encryptedSessionInfo
    });
  } catch (error: any) {
    console.error('Telegram login error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to send verification code' 
    }, { status: 500 });
  }
}
