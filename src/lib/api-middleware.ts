import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';
import { isValidWalletAddress } from './auth-utils';

// Create a Supabase admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Extended request type with authentication information
export interface AuthenticatedRequest extends NextRequest {
  userId: string;
  walletAddress: string;
}

// Type for route handlers that use authentication
export type AuthenticatedRouteHandler = (
  req: AuthenticatedRequest
) => Promise<NextResponse> | NextResponse;

/**
 * Helper function to handle authenticated requests
 * @param user The authenticated user
 * @param walletAddress The wallet address
 * @param req The original request
 * @param handler The route handler to call
 * @returns Response from the handler
 */
function handleAuthenticatedRequest(
  user: { id: string },
  walletAddress: string,
  req: NextRequest,
  handler: AuthenticatedRouteHandler
): Promise<NextResponse> | NextResponse {
  // Add user information to request
  const authenticatedReq = req as AuthenticatedRequest;
  authenticatedReq.userId = user.id;
  authenticatedReq.walletAddress = walletAddress;
  
  // Call route handler with authenticated request
  return handler(authenticatedReq);
}

/**
 * Middleware to verify authentication for API routes
 * @param req The incoming request
 * @param handler The route handler to call if authentication is successful
 * @returns Response from the handler or 401 Unauthorized
 */
export async function withAuth(
  req: NextRequest,
  handler: AuthenticatedRouteHandler
): Promise<NextResponse> {
  // Get authorization header
  const authHeader = req.headers.get('Authorization');
  
  // Check if authorization header exists and has correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Extract wallet address from header
  const walletAddress = authHeader.replace('Bearer ', '').trim();
  
  // Validate wallet address format
  if (!isValidWalletAddress(walletAddress)) {
    return NextResponse.json(
      { error: 'Invalid wallet address' },
      { status: 401 }
    );
  }
  
  try {
    console.log('API Middleware: Authenticating wallet address:', walletAddress);
    
    // Look up user by wallet address
    const { data: users, error } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress);
    
    // Log the result for debugging
    console.log('API Middleware: Query result:', { users, error });
    
    // If error occurred
    if (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Database error during authentication' },
        { status: 500 }
      );
    }
    
    // If no users found
    if (!users || users.length === 0) {
      console.error('Authentication error: No user found with wallet address', walletAddress);
      
      // Auto-create user if not found - using admin client to bypass RLS
      console.log('API Middleware: Creating new user with wallet:', walletAddress);
      
      try {
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert({
            wallet_address: walletAddress,
          })
          .select('id')
          .single();
        
        if (createError) {
          // Check if this is a duplicate key error
          if (createError.code === '23505') {
            console.log('API Middleware: User already exists, retrieving user...');
            
            // Try to get the existing user with exact match
            const { data: existingUser, error: fetchError } = await supabaseAdmin
              .from('users')
              .select('id')
              .eq('wallet_address', walletAddress)
              .single();
            
            if (fetchError || !existingUser) {
              console.error('API Middleware: Error fetching existing user:', fetchError);
              return NextResponse.json(
                { error: 'Failed to retrieve existing user' },
                { status: 500 }
              );
            }
            
            console.log('API Middleware: Retrieved existing user:', existingUser.id);
            return handleAuthenticatedRequest(existingUser, walletAddress, req, handler);
          } else {
            console.error('API Middleware: Error creating user:', createError);
            return NextResponse.json(
              { error: 'Failed to create user' },
              { status: 500 }
            );
          }
        }
        
        if (!newUser) {
          console.error('API Middleware: No user created and no error returned');
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          );
        }
        
        // Create default user_public_metadata record for the new user
        const { error: metadataError } = await supabaseAdmin
          .from('user_public_metadata')
          .insert({
            user_id: newUser.id,
            websites: [],
            total_generated: 0,
            total_spent: 0,
            payments: []
          });
        
        if (metadataError) {
          console.error('API Middleware: Error creating user metadata:', metadataError);
          // Continue anyway, as the user was created successfully
          console.warn('API Middleware: Continuing despite metadata creation error');
        } else {
          console.log('API Middleware: Created default metadata for user:', newUser.id);
        }
        
        console.log('API Middleware: New user created:', newUser.id);
        return handleAuthenticatedRequest(newUser, walletAddress, req, handler);
      } catch (error) {
        console.error('API Middleware: Exception during user creation:', error);
        return NextResponse.json(
          { error: 'Internal server error during user creation' },
          { status: 500 }
        );
      }
      
      // This code is now handled in the try/catch block above
    }
    
    // Use the first user found
    const user = users[0];
    return handleAuthenticatedRequest(user, walletAddress, req, handler);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
