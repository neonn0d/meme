import { auth, clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const attemptsByIP: { [key: string]: { count: number; timestamp: number } } = {};

// Clean up old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  Object.keys(attemptsByIP).forEach(ip => {
    if (now - attemptsByIP[ip].timestamp > RATE_LIMIT_WINDOW) {
      delete attemptsByIP[ip];
    }
  });
}, 60 * 60 * 1000);

interface Payment {
  type: string;
  amount: number;
  status: string;
  network: string;
  timestamp: number;
  expiryDate: number;
  transactionHash: string;
}

interface Website {
  price?: number;
  timestamp: string;
  transactionHash?: string;
}

interface UserMetadata {
  payments?: Payment[];
  websites?: Website[];
  totalSpent?: number;
  totalGenerated?: number;
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password + process.env.ADMIN_PASSWORD).digest('hex');
}

export async function GET() {
  try {
    const { userId } = auth();
    const headersList = headers();
    
    if (!userId) {
      console.error('Unauthorized access attempt to /api/users');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    if (!attemptsByIP[ip]) {
      attemptsByIP[ip] = { count: 0, timestamp: now };
    } else if (now - attemptsByIP[ip].timestamp > RATE_LIMIT_WINDOW) {
      attemptsByIP[ip] = { count: 0, timestamp: now };
    }

    if (attemptsByIP[ip].count >= MAX_ATTEMPTS) {
      console.error(`Rate limit exceeded for IP ${ip}`);
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Check admin password
    const adminPassword = headersList.get('X-Admin-Password');
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || !correctPassword || hashPassword(adminPassword) !== hashPassword(correctPassword)) {
      console.error(`Invalid password attempt from user ${userId} (IP: ${ip})`);
      attemptsByIP[ip].count++;
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 403 }
      );
    }

    console.log('Fetching user list...');
    const users = await clerkClient.users.getUserList({
      limit: 500, // Increased limit to get more users
      orderBy: '-created_at'
    });
    
    const usersData = users.map(user => {
      const metadata = user.publicMetadata as UserMetadata;

      // Ensure arrays are sorted by timestamp (newest first)
      if (metadata?.payments) {
        metadata.payments.sort((a, b) => b.timestamp - a.timestamp);
      }

      if (metadata?.websites) {
        metadata.websites.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }

      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        metadata: metadata,
        lastSignInAt: user.lastSignInAt,
        createdAt: user.createdAt
      };
    });

    // Filter users to only show those with payments or premium
    const filteredUsers = usersData.filter(user => {
      const metadata = user.metadata;
      const hasPayments = metadata?.payments && metadata.payments.length > 0;
      const hasWebsites = metadata?.websites && metadata.websites.length > 0;
      return hasPayments || hasWebsites;
    });

    // Reset attempt counter on successful auth
    if (attemptsByIP[ip]) {
      attemptsByIP[ip].count = 0;
    }
    
    console.log(`Successfully fetched ${filteredUsers.length} users`);
    return NextResponse.json({
      users: filteredUsers
    });

  } catch (error) {
    console.error('Error in /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
