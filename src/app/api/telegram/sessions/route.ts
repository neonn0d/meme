import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { getSessionsFromSupabase } from '@/lib/telegram';

export async function GET(req: Request) {
  // Get the authorization header
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Extract the user ID from the Bearer token
  // For now, we're using the wallet address as the token, but we'll use it to directly query the user ID
  const token = authHeader.replace('Bearer ', '');
  
  // Check if Supabase admin client is available
  if (!supabaseAdmin) {
    console.error('API: Supabase admin client not available');
    return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
  }
  
  // Hardcoded user ID for testing
  const userId = '507d1b70-0089-4823-bcb8-b0ac40faca16';
  console.log('API: Using hardcoded user ID for testing:', userId);

  try {
    // Get sessions from Supabase's user_private_metadata table
    console.log('API: Getting sessions for user ID:', userId);
    const sessions = await getSessionsFromSupabase(userId);
    
    console.log('API: Sessions retrieved:', sessions ? sessions.length : 0);
    return NextResponse.json({ 
      success: true, 
      sessions: sessions
    });
  } catch (error: any) {
    console.error('Error fetching Telegram sessions:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch sessions' 
    }, { status: 500 });
  }
}
