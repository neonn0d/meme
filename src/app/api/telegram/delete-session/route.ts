import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { deleteSessionFromClerk } from '@/lib/telegram';

export async function POST(req: Request) {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the phone number from the request
    const { phone } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Delete the session from Clerk's private metadata
    await deleteSessionFromClerk(userId, phone);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Session deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete session' 
    }, { status: 500 });
  }
}
