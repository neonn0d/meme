import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';

export async function GET() {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the user's metadata directly from Clerk
    const user = await clerkClient.users.getUser(userId);
    const privateMetadata = user.privateMetadata || {};
    
    // Return the metadata (safely - don't expose actual session strings)
    const safeMetadata = { ...privateMetadata };
    
    // If there are telegram sessions, replace the session strings with their length
    if ((safeMetadata as any).telegramSessions) {
      (safeMetadata as any).telegramSessions = (safeMetadata as any).telegramSessions.map((s: any) => ({
        ...s,
        session: s.session ? `[Session string: ${s.session.length} chars]` : '[No session string]'
      }));
    }
    
    return NextResponse.json({ 
      success: true, 
      metadata: safeMetadata,
      hasMetadata: Object.keys(privateMetadata).length > 0,
      hasTelegramSessions: Boolean((privateMetadata as any)?.telegramSessions?.length)
    });
  } catch (error: any) {
    console.error('Error debugging Clerk metadata:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to debug Clerk metadata' 
    }, { status: 500 });
  }
}
