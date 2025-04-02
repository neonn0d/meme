import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Migration is complete - all sessions are now stored in Clerk's private metadata
  return NextResponse.json({ 
    success: true, 
    message: 'Migration is complete. All sessions are now stored in Clerk\'s private metadata.'
  });
}
