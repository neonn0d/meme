import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';
import { withAuth, AuthenticatedRequest } from '@/lib/api-middleware';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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

interface UserProfile {
  id: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
  email?: string;
  username?: string;
  metadata?: any;
}

interface UserSubscription {
  id: string;
  user_id: string;
  status: string;
  price_id: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_hash: string;
  created_at: string;
}

interface UserMetadata {
  user_id: string;
  total_generated: number;
  total_spent: number;
  websites: any[];
}

function hashPassword(password: string): string {
  // Use a fixed salt for hashing (in a production environment, this should be a separate env variable)
  const salt = 'meme-generator-salt';
  return createHash('sha256').update(password + salt).digest('hex');
}

export async function GET(req: NextRequest) {
  // Check for admin password first
  const headersList = headers();
  const adminPassword = headersList.get('X-Admin-Password');
  const correctPassword = process.env.ADMIN_PASSWORD;

  // If admin password is provided and correct, bypass normal auth
  if (adminPassword && correctPassword && adminPassword === correctPassword) {
    console.log('Admin access granted via password');
    // Create a minimal authenticated request
    const adminReq = req as AuthenticatedRequest;
    adminReq.userId = 'admin';
    adminReq.walletAddress = '';
    return handleGetUsers(adminReq);
  }

  // Otherwise, require normal authentication
  return withAuth(req, handleGetUsers);
}

async function handleGetUsers(req: AuthenticatedRequest) {
  try {
    const userId = req.userId;
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

    // Skip admin password check if already verified in the GET handler
    if (userId !== 'admin') {
      // Check admin password
      const adminPassword = headersList.get('X-Admin-Password');
      const correctPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword || !correctPassword || adminPassword !== correctPassword) {
        console.error(`Invalid password attempt from user ${userId} (IP: ${ip})`);
        attemptsByIP[ip].count++;
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 403 }
        );
      }
    }

    console.log('Fetching user list from Supabase...');
    
    // Use supabaseAdmin to bypass RLS for admin queries
    // Get users from Supabase
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
      
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Error fetching users' },
        { status: 500 }
      );
    }
    
    console.log(`Found ${users?.length || 0} users in the database`);
    
    // Get payments
    const { data: payments, error: paymentsError } = await supabaseAdmin
      .from('payments')
      .select('*');
      
    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      // Continue anyway, just without payment data
    }
    
    console.log(`Found ${payments?.length || 0} payments in the database`);
    
    // Get user metadata
    const { data: userMetadata, error: metadataError } = await supabaseAdmin
      .from('user_public_metadata')
      .select('*');
      
    if (metadataError) {
      console.error('Error fetching user metadata:', metadataError);
      // Continue anyway, just without metadata
    }
    
    console.log(`Found ${userMetadata?.length || 0} user metadata records in the database`);
    
    // Get subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');
      
    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
      // Continue anyway, just without subscriptions
    }
    
    // Combine data
    const enrichedUsers = users.map((user: any) => {
      const metadata = userMetadata?.find((m: any) => m.user_id === user.id);
      const userSubscriptions = subscriptions?.filter((s: any) => s.user_id === user.id) || [];
      const userPayments = payments?.filter((p: any) => p.user_id === user.id) || [];
      
      return {
        ...user,
        subscriptions: userSubscriptions,
        payments: userPayments,
        metadata: metadata || null
      };
    });

    // Calculate stats
    const stats = {
      totalUsers: users.length,
      premiumUsers: subscriptions?.filter((sub: any) => sub.status === 'active').length || 0,
      usersWithWebsites: userMetadata?.filter((meta: any) => meta.total_generated > 0).length || 0,
      activeUsers: users.filter((user: any) => {
        // Consider a user active if they've logged in within the last 30 days
        const lastLogin = new Date(user.last_sign_in_at || user.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastLogin > thirtyDaysAgo;
      }).length
    };

    // Reset attempt counter on successful auth
    if (attemptsByIP[ip]) {
      attemptsByIP[ip].count = 0;
    }
    
    console.log(`Successfully fetched ${enrichedUsers.length} users`);
    return NextResponse.json({
      users: enrichedUsers,
      stats: stats
    });

  } catch (error) {
    console.error('Error in /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
