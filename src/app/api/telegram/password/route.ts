import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
  // Check authentication
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { password, sessionInfo } = await req.json();

    if (!password || !sessionInfo) {
      return NextResponse.json({ error: 'Password and session info are required' }, { status: 400 });
    }

    // Redirect to the code route with an empty code
    // This is now handled by the code route with the combined approach
    const response = await fetch(new URL('/api/telegram/code', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: '', password, sessionInfo }),
    });

    // Return the response from the code route
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Telegram password verification error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to verify password' 
    }, { status: 500 });
  }
}
