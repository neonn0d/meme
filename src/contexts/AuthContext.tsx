'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabase';

// Define the shape of our authentication context
interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  userProfile: any | null;
  refreshUserProfile: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoading: true,
  isSignedIn: false,
  userProfile: null,
  refreshUserProfile: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// We'll use the API endpoint for admin operations

// Provider component to wrap our app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected } = useWallet();
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Function to fetch user profile from Supabase
  const fetchUserProfile = async (walletAddress: string) => {
    console.log('Fetching user profile for wallet:', walletAddress);
    
    try {
      // First check if user exists
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
      
      console.log('Existing user query result:', { existingUser, error: error ? error.message : null });

      if (existingUser) {
        setUserId(existingUser.id);
        setUserProfile(existingUser);
        return;
      }

      // If user doesn't exist, create a new one
      console.log('Creating new user with wallet:', walletAddress);
      
      try {
        // Create the user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
          })
          .select()
          .single();

        console.log('New user creation result:', { newUser, createError });

        if (createError) {
          console.error('Error creating user:', createError);
          return;
        }

        if (newUser) {
          console.log('Setting user ID from new user:', newUser.id);
          setUserId(newUser.id);
          setUserProfile(newUser);
          
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
        }
      } catch (createUserError) {
        console.error('Unexpected error during user creation:', createUserError);
      }
      
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Function to refresh user profile
  const refreshUserProfile = async () => {
    if (!connected || !publicKey) return;
    
    const walletAddress = publicKey.toString();
    await fetchUserProfile(walletAddress);
  };

  // Effect to initialize auth state when wallet connection changes
  useEffect(() => {
    console.log('Wallet connection changed:', { connected, publicKey: publicKey?.toString() });
    
    // IMMEDIATELY set signed in state based on wallet connection
    // This ensures the UI updates right away
    if (connected && publicKey) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
      setUserId(null);
      setUserProfile(null);
      setIsLoading(false);
      return;
    }
    
    // Only proceed with database operations if wallet is connected
    if (!connected || !publicKey) {
      console.log('No wallet connection, auth state cleared');
      setIsLoading(false);
      return;
    }
    
    // Start the async database operations
    const initializeAuth = async () => {
      setIsLoading(true);
      const walletAddress = publicKey.toString();
      
      try {
        // Use the API endpoint to handle user lookup/creation
        console.log('Using API to authenticate wallet:', walletAddress);
        
        const response = await fetch('/api/auth/solana', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error:', errorData);
          throw new Error(errorData.error || 'Failed to authenticate');
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.user) {
          console.log('User authenticated:', data.user.id);
          setUserId(data.user.id);
          setUserProfile(data.user);
        } else {
          console.error('No user returned from API');
        }
      } catch (error) {
        console.error('Error in user lookup/creation:', error);
      } finally {
        console.log('Auth initialization complete with wallet:', walletAddress);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, [connected, publicKey]);

  return (
    <AuthContext.Provider 
      value={{ 
        userId, 
        isLoading, 
        isSignedIn, 
        userProfile,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
