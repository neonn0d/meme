import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { getSessionsFromClerk, saveSessionToClerk } from '@/lib/telegram';

export async function GET() {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get sessions from Clerk's private metadata only
    const clerkSessions = await getSessionsFromClerk(userId);
    
    return NextResponse.json({ 
      success: true, 
      sessions: clerkSessions
    });
  } catch (error: any) {
    console.error('Error fetching Telegram sessions:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch sessions' 
    }, { status: 500 });
  }
}
