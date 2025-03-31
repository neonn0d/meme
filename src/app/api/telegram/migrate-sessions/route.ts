import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { getAvailableSessions, saveSessionToClerk } from '@/lib/telegram';
import fs from 'fs';

export async function POST(req: Request) {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all available sessions from file system
    const fileSessions = getAvailableSessions();
    
    if (fileSessions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No file-based sessions found to migrate'
      });
    }
    
    // Migrate each session to Clerk
    const results = {
      successful: [] as string[],
      failed: [] as {phone: string, error: string}[]
    };
    
    for (const session of fileSessions) {
      try {
        // Read the session file content
        const fileContent = fs.readFileSync(session.path, 'utf8');
        const sessionData = JSON.parse(fileContent);
        
        // Save session to Clerk
        await saveSessionToClerk(userId, session.phone, sessionData.session);
        results.successful.push(session.phone);
      } catch (error: any) {
        results.failed.push({
          phone: session.phone,
          error: error.message || 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      message: `Successfully migrated ${results.successful.length} sessions, failed to migrate ${results.failed.length} sessions`
    });
  } catch (error: any) {
    console.error('Error migrating sessions:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to migrate sessions' 
    }, { status: 500 });
  }
}
