import { auth, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      console.error('Unauthorized access attempt to /api/users');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin password
    const headersList = headers();
    const adminPassword = headersList.get('X-Admin-Password');
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || adminPassword !== correctPassword) {
      console.error(`Invalid password attempt from user ${userId}`);
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 403 }
      );
    }

    console.log('Fetching user list...');
    const users = await clerkClient.users.getUserList({
      limit: 100, // Adjust this based on your needs
      orderBy: '-created_at'
    });
    
    // Map users to only include necessary data
    const usersData = users.map(user => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      metadata: user.publicMetadata,
      lastSignInAt: user.lastSignInAt,
      createdAt: user.createdAt
    }));
    
    console.log(`Successfully fetched ${usersData.length} users`);
    return NextResponse.json({
      users: usersData
    });
  } catch (error) {
    console.error('Error in /api/users:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
