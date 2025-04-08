# Clerk to Solana Wallet Authentication Migration Plan

## Overview

This document outlines a comprehensive plan to migrate the authentication system from Clerk to Solana wallet authentication with Supabase as the backend database. The migration will involve changes to authentication flows, data storage, API routes, and UI components.

## ClientLayout and Authentication Implementation

### Authentication Context

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  userProfile: any | null;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoading: true,
  isSignedIn: false,
  userProfile: null,
  refreshUserProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected } = useWallet();
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (walletAddress: string) => {
    try {
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (existingUser) {
        setUserId(existingUser.id);
        setUserProfile(existingUser);
        
        // Also fetch metadata
        const { data: publicMeta } = await supabase
          .from('user_public_metadata')
          .select('*')
          .eq('user_id', existingUser.id)
          .single();
          
        if (publicMeta) {
          setUserProfile(prev => ({
            ...prev,
            publicMetadata: publicMeta
          }));
        }
        
        return;
      }

      // If user doesn't exist, create a new one
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return;
      }

      // Initialize metadata tables
      await supabase
        .from('user_public_metadata')
        .insert({
          user_id: newUser.id,
          websites: [],
          total_generated: 0,
          total_spent: 0,
          payments: []
        });
      
      await supabase
        .from('user_private_metadata')
        .insert({
          user_id: newUser.id,
          telegram_sessions: []
        });

      setUserId(newUser.id);
      setUserProfile(newUser);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const refreshUserProfile = async () => {
    if (!connected || !publicKey) return;
    
    const walletAddress = publicKey.toString();
    await fetchUserProfile(walletAddress);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      if (!connected || !publicKey) {
        setUserId(null);
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      const walletAddress = publicKey.toString();
      await fetchUserProfile(walletAddress);
      setIsLoading(false);
    };

    initializeAuth();
  }, [publicKey, connected]);

  return (
    <AuthContext.Provider 
      value={{ 
        userId, 
        isLoading, 
        isSignedIn: !!userId, 
        userProfile,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

### Updated ClientLayout

```tsx
// src/components/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SolanaProvider } from './SolanaProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Only hide navbar and footer on preview and customize pages
  const isPreviewPage = pathname === "/preview";
  const isCustomizePage = pathname === "/customize";
  const hideNavbarAndFooter = isPreviewPage || isCustomizePage;

  return (
    <SolanaProvider>
      <AuthProvider>
        {!hideNavbarAndFooter && <Navbar />}
        <main className={!isPreviewPage ? "min-h-[calc(100vh-20rem)]" : "min-h-screen"}>
          {children}
        </main>
        {!hideNavbarAndFooter && <Footer />}
        <Toaster position="bottom-right" />
      </AuthProvider>
    </SolanaProvider>
  );
}
```

### Protected Routes Component

```tsx
// src/components/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isSignedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
}
```

### Navbar with Wallet Integration

```tsx
// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  children?: React.ReactNode;
  className?: string;
}

export function Navbar({ children, className = "" }: NavbarProps) {
  const { connected } = useWallet();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/telegram", label: "Telegram" },
    { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <nav className={`fixed w-full bg-white shadow-sm border-b border-zinc-200 z-50 ${className}`}>
      <div className={`mx-auto transition-[max-width] duration-200 ${
        pathname === "/customize" ? "max-w-full" : "max-w-7xl"
      } px-4 sm:px-8 lg:px-8`}>
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-zinc-900 hover:text-zinc-700 transition-colors">
              BUIDL
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {connected ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActivePath(link.href)
                        ? "text-zinc-900"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {children}
                <WalletMultiButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors">
                  Connect Wallet
                </Link>
                <Link href="/templates" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                  Browse Templates
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {connected && <WalletMultiButton />}
            <button
              type="button"
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {connected ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActivePath(link.href)
                          ? "text-zinc-900 bg-zinc-50"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="block px-3 py-2 rounded-md text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connect Wallet
                  </Link>
                  <Link
                    href="/templates"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-zinc-900 text-white hover:bg-zinc-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Browse Templates
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

## Current System Analysis

### Authentication Flow

- **Clerk Authentication**: Currently handles user sign-up, sign-in, and session management
- **Middleware**: Protects routes and redirects unauthenticated users
- **User Data**: Stored in Clerk's public and private metadata

### Data Storage in Clerk

#### Public Metadata
- Website generation history
- Payment records and subscription status
- Usage statistics (totalGenerated, totalSpent)

#### Private Metadata
- Telegram sessions (with size optimization)
- Sensitive user information

### Integration Points

1. **Authentication Middleware** (`src/middleware.ts`)
   - Protects routes using Clerk's `authMiddleware`
   - Defines public routes and handles redirects

2. **API Routes**
   - User subscription verification (`/api/user/subscription/route.ts`)
   - Payment management (`/api/payments/route.ts`)
   - Website generation tracking (`/api/websites/route.ts`)

3. **Telegram Integration** (`src/lib/telegram.ts`)
   - Stores and retrieves Telegram sessions from Clerk's private metadata
   - Implements size optimization for metadata storage

4. **UI Components**
   - Navbar with authentication state (`src/components/Navbar.tsx`)
   - Dashboard with user data (`src/app/(dashboard)/dashboard/page.tsx`)
   - Subscription management (`src/hooks/useSubscription.ts`)

## Migration Strategy

### 1. Supabase Database Setup

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public metadata table
CREATE TABLE user_public_metadata (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  websites JSONB DEFAULT '[]',
  total_generated INTEGER DEFAULT 0,
  total_spent DECIMAL DEFAULT 0,
  payments JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Private metadata table
CREATE TABLE user_private_metadata (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  telegram_sessions JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  amount DECIMAL,
  transaction_hash TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Solana Wallet Authentication Implementation

#### Dependencies
```bash
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets @supabase/supabase-js
```

#### Supabase Client Setup
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Solana Wallet Provider
```typescript
// src/providers/SolanaWalletProvider.tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

### 3. Authentication Middleware Replacement

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/pricing",
    "/docs",
  ];
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
  );
  
  if (isPublicRoute) {
    return res;
  }
  
  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session && !isPublicRoute) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 4. Data Migration Process

#### Migration Script
```typescript
// scripts/migrate-clerk-to-supabase.ts
import { clerkClient } from '@clerk/nextjs';
import { supabase } from '../src/lib/supabase';

async function migrateUserData() {
  // Get all users from Clerk
  const clerkUsers = await clerkClient.users.getUserList();
  
  for (const clerkUser of clerkUsers) {
    // Check if user has a Solana wallet address in metadata
    const walletAddress = clerkUser.publicMetadata.solanaWallet as string;
    
    if (!walletAddress) {
      console.log(`User ${clerkUser.id} has no Solana wallet address, skipping`);
      continue;
    }
    
    // Create user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating user for ${clerkUser.id}:`, error);
      continue;
    }
    
    // Migrate public metadata
    await supabase
      .from('user_public_metadata')
      .insert({
        user_id: user.id,
        websites: clerkUser.publicMetadata.websites || [],
        total_generated: clerkUser.publicMetadata.totalGenerated || 0,
        total_spent: clerkUser.publicMetadata.totalSpent || 0,
        payments: clerkUser.publicMetadata.payments || [],
      });
    
    // Migrate private metadata
    await supabase
      .from('user_private_metadata')
      .insert({
        user_id: user.id,
        telegram_sessions: clerkUser.privateMetadata.telegramSessions || [],
      });
    
    // Migrate subscription data
    const payments = clerkUser.publicMetadata.payments as any[] || [];
    const premiumPayments = payments.filter(payment => 
      payment.type === 'premium' && 
      payment.status === 'completed'
    );
    
    for (const payment of premiumPayments) {
      await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          type: payment.type,
          status: payment.status,
          amount: payment.amount,
          transaction_hash: payment.transactionHash,
          purchase_date: payment.timestamp,
          expiry_date: payment.expiryDate,
        });
    }
    
    console.log(`Successfully migrated user ${clerkUser.id} to Supabase`);
  }
}

migrateUserData()
  .then(() => console.log('Migration completed'))
  .catch(error => console.error('Migration failed:', error));
```

### 5. API Routes Replacement

#### User Subscription API
```typescript
// src/app/api/user/subscription/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getWalletAddress } from '@/lib/auth';

export async function GET(req: Request) {
  const walletAddress = await getWalletAddress(req);
  
  if (!walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user by wallet address
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check for active subscription
    const now = new Date().toISOString();
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'premium')
      .eq('status', 'completed')
      .gt('expiry_date', now)
      .order('expiry_date', { ascending: false })
      .limit(1)
      .single();
    
    return NextResponse.json({
      isSubscribed: !!subscription,
      subscription: subscription ? {
        expiryDate: subscription.expiry_date,
        purchaseDate: subscription.purchase_date,
        amount: subscription.amount
      } : null
    });
  } catch (error: any) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to check subscription status' 
    }, { status: 500 });
  }
}
```

#### Payments API
```typescript
// src/app/api/payments/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getWalletAddress } from '@/lib/auth';

export async function GET(req: Request) {
  const walletAddress = await getWalletAddress(req);
  
  if (!walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user by wallet address
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get user's public metadata
    const { data: metadata } = await supabase
      .from('user_public_metadata')
      .select('payments, total_spent')
      .eq('user_id', user.id)
      .single();
    
    return NextResponse.json({
      payments: metadata?.payments || [],
      totalSpent: metadata?.total_spent || 0
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const walletAddress = await getWalletAddress(req);
  
  if (!walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payment } = await req.json();
    
    // Get user by wallet address
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get current metadata
    const { data: metadata } = await supabase
      .from('user_public_metadata')
      .select('payments, total_spent')
      .eq('user_id', user.id)
      .single();
    
    const existingPayments = metadata?.payments || [];
    const existingTotalSpent = metadata?.total_spent || 0;
    
    // Update metadata
    const { data: updatedMetadata } = await supabase
      .from('user_public_metadata')
      .update({
        payments: [...existingPayments, payment],
        total_spent: existingTotalSpent + payment.amount
      })
      .eq('user_id', user.id)
      .select()
      .single();
    
    // If this is a premium payment, add to subscriptions table
    if (payment.type === 'premium') {
      await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          type: payment.type,
          status: payment.status,
          amount: payment.amount,
          transaction_hash: payment.transactionHash,
          purchase_date: payment.timestamp,
          expiry_date: payment.expiryDate
        });
    }
    
    return NextResponse.json({
      success: true,
      metadata: updatedMetadata
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### 6. Telegram Integration Update

```typescript
// src/lib/telegram.ts
import { StringSession } from 'telegram/sessions';
import { supabase } from '@/lib/supabase';

// Function to save session to Supabase's private metadata
export const saveSessionToSupabase = async (
  userId: string, 
  phoneNumber: string, 
  sessionString: string,
  userInfo?: any
): Promise<void> => {
  try {
    console.log(`Saving session to Supabase for phone: ${phoneNumber}, userId: ${userId}`);
    
    // Get existing private metadata
    const { data: metadata } = await supabase
      .from('user_private_metadata')
      .select('telegram_sessions')
      .eq('user_id', userId)
      .single();
    
    // Get existing telegram sessions or create an empty array
    const telegramSessions = metadata?.telegram_sessions || [];
    console.log(`Found ${telegramSessions.length} existing sessions in Supabase metadata`);
    
    // Check if a session with this phone number already exists
    const existingSessionIndex = telegramSessions.findIndex((s: any) => s.phone === phoneNumber);
    
    // Optimize userInfo to reduce size if it exists
    let optimizedUserInfo: Record<string, any> | null = null;
    if (userInfo) {
      // Create a copy of userInfo with only essential fields
      optimizedUserInfo = {
        id: userInfo.id,
        firstName: userInfo.firstName ? encodeEmojiForStorage(userInfo.firstName) : '',
        lastName: userInfo.lastName ? encodeEmojiForStorage(userInfo.lastName) : '',
        username: userInfo.username || '',
        phone: userInfo.phone || phoneNumber,
        premium: userInfo.premium || false,
        verified: userInfo.verified || false
      };
      
      // Handle photo separately
      if (userInfo.photo) {
        optimizedUserInfo.hasPhoto = true;
      }
    }
    
    // Create new session object with optimized userInfo if provided
    const sessionObject = {
      phone: phoneNumber,
      session: sessionString,
      created: new Date().toISOString(),
      ...(optimizedUserInfo ? { userInfo: optimizedUserInfo } : {})
    };
    
    // Update sessions array
    const updatedSessions = [...telegramSessions];
    if (existingSessionIndex !== -1) {
      updatedSessions[existingSessionIndex] = {
        ...updatedSessions[existingSessionIndex],
        ...sessionObject
      };
    } else {
      updatedSessions.push(sessionObject);
    }
    
    // Update the user's private metadata
    await supabase
      .from('user_private_metadata')
      .update({
        telegram_sessions: updatedSessions,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    console.log(`Successfully saved session to Supabase for ${phoneNumber}`);
  } catch (error) {
    console.error('Error saving Telegram session to Supabase:', error);
    throw error;
  }
};

// Other functions similarly updated...
```

### 7. UI Components Update

#### Navbar Component
```tsx
// src/components/Navbar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

interface NavbarProps {
  children?: React.ReactNode
  className?: string
}

export function Navbar({ children, className = "" }: NavbarProps) {
  const { connected } = useWallet()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActivePath = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/telegram", label: "Telegram" },
    { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
  ]

  return (
    <nav
      className={`fixed w-full bg-white shadow-sm border-b border-zinc-200 z-50 ${className}`}
    >
      {/* Component implementation with WalletMultiButton instead of UserButton */}
    </nav>
  )
}
```

### 8. Authentication Hooks

```typescript
// src/hooks/useAuth.ts
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { publicKey, connected } = useWallet();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserId() {
      if (!connected || !publicKey) {
        setUserId(null);
        setIsLoading(false);
        return;
      }

      try {
        const walletAddress = publicKey.toString();
        
        // Check if user exists
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', walletAddress)
          .single();
        
        if (user) {
          setUserId(user.id);
        } else {
          // Create new user if not exists
          const { data: newUser, error } = await supabase
            .from('users')
            .insert({
              wallet_address: walletAddress,
            })
            .select()
            .single();
          
          if (error) {
            console.error('Error creating user:', error);
            setUserId(null);
          } else {
            setUserId(newUser.id);
            
            // Initialize metadata tables
            await supabase
              .from('user_public_metadata')
              .insert({
                user_id: newUser.id,
              });
            
            await supabase
              .from('user_private_metadata')
              .insert({
                user_id: newUser.id,
              });
          }
        }
      } catch (error) {
        console.error('Error in useAuth:', error);
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    }

    getUserId();
  }, [publicKey, connected]);

  return { userId, isLoading, isSignedIn: !!userId };
}
```

## Implementation Timeline

### Phase 1: Setup and Infrastructure (Week 1)
- Set up Supabase project and database
- Implement Solana wallet provider
- Create authentication hooks

### Phase 2: Core Authentication (Week 2)
- Implement wallet connection UI
- Replace Clerk middleware with custom middleware
- Update layout with Solana provider

### Phase 3: API Migration (Weeks 3-4)
- Update API routes to use Supabase
- Implement data access functions
- Test API endpoints

### Phase 4: UI Components (Week 5)
- Update Navbar and authentication UI
- Modify dashboard and other pages
- Implement wallet-specific UI elements

### Phase 5: Data Migration (Week 6)
- Develop migration script
- Test migration with sample data
- Perform full migration

### Phase 6: Testing and Deployment (Week 7)
- Comprehensive testing
- Fix bugs and issues
- Deploy to production

## Security Considerations

1. **Wallet Signature Verification**
   - Implement proper signature verification for wallet authentication
   - Use nonce-based challenges to prevent replay attacks

2. **Database Security**
   - Set up proper RLS (Row Level Security) in Supabase
   - Ensure sensitive data is properly protected

3. **API Security**
   - Implement rate limiting
   - Add CSRF protection
   - Validate all inputs

4. **Error Handling**
   - Implement proper error handling throughout the application
   - Avoid exposing sensitive information in error messages

## Rollback Plan

In case of critical issues during migration:

1. Keep Clerk integration active during initial phases
2. Implement feature flags to control which authentication system is active
3. Maintain database backups before and during migration
4. Have a quick rollback procedure to revert to Clerk if needed

## Post-Migration Tasks

1. Monitor application performance and user feedback
2. Optimize database queries and authentication flow
3. Remove Clerk dependencies completely
4. Update documentation
