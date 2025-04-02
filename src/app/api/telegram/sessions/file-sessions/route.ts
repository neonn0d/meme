import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

// File-based sessions are no longer used, all sessions are stored in Clerk's private metadata

export async function GET() {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return empty array as we no longer use file-based sessions
  return NextResponse.json({ 
    success: true, 
    message: 'File-based sessions are no longer used. All sessions are stored in Clerk\'s private metadata.',
    sessions: []
  });
}

export async function POST(req: Request) {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return not found as we no longer use file-based sessions
  return NextResponse.json({ 
    success: false, 
    message: 'File-based sessions are no longer used. All sessions are stored in Clerk\'s private metadata.',
    error: 'Session not found'
  }, { status: 404 });
}
