import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Define public routes that don't need authentication
  const publicPaths = [
    '/',                // Home page
    '/sign-in',         // Sign-in page
    '/pricing',         // Pricing page
    '/docs',            // Documentation
    '/check-payments',  // Payment debugging page
    '/_next',           // Next.js assets
    '/favicon.ico',     // Favicon
    '/api/auth/solana', // Auth API endpoint
    '/api/debug-db',    // Debug database endpoint
    '/api/public'       // Public API routes
  ];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/')
  );
  
  // Allow access to public paths
  if (isPublicPath) {
    return response;
  }
  
  // For API routes that are not public, check for authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // For API routes, we could check for a valid session token
    // But for now, we'll let the API route handlers handle authentication
    return response;
  }
  
  // For all other routes, let the app handle authentication via the ProtectedRoute component
  // This allows client-side authentication with the wallet adapter
  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and _next
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
