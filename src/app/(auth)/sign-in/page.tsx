'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function SignInPage() {
  const { connected } = useWallet();
  const { isSignedIn, isLoading } = useAuth();
  const { verifyWallet, isVerifying, error } = useWalletAuth();
  const router = useRouter();
  const [needsVerification, setNeedsVerification] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('/dashboard');
  
  // Check for redirect URL in query params and save it
  useEffect(() => {
    // Get the redirect URL from the query string if it exists
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    } else {
      // Check if we came from another page via referrer
      const referrer = document.referrer;
      if (referrer && referrer.startsWith(window.location.origin) && !referrer.includes('/sign-in')) {
        const path = new URL(referrer).pathname;
        setRedirectUrl(path);
      }
    }
  }, []);

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn && !isLoading) {
      console.log('User is signed in, redirecting to:', redirectUrl);
      router.replace(redirectUrl);
    }
  }, [isSignedIn, isLoading, router, redirectUrl]);
  
  // Prompt for verification when wallet connects
  useEffect(() => {
    if (connected && !isSignedIn && !isLoading && !isVerifying && !needsVerification) {
      setNeedsVerification(true);
    }
  }, [connected, isSignedIn, isLoading, isVerifying, needsVerification]);
  
  // Handle verification request
  const handleVerify = async () => {
    setNeedsVerification(false);
    const success = await verifyWallet();
    if (success) {
      // Verification successful, AuthContext will handle the rest
      console.log('Wallet verified successfully');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md space-y-8">
        <div className="text-center">
          {/* BUIDL connecting to Telegram */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-8">
              {/* BUIDL Logo */}
              <div className="rounded-full bg-black flex items-center justify-center flex p-2" style={{ width: '60px', height: '60px' }}>
                <span className="text-white font-bold text-base tracking-wider">BUIDL</span>
              </div>
              
              {/* Connecting Line */}
              <div className="h-0.5 w-8 bg-zinc-300"></div>
              
              {/* Telegram Logo */}
              <div className="rounded-full bg-black flex items-center justify-center p-2" style={{ width: '60px', height: '60px' }}>
                <img 
                  src="https://i.imgur.com/5tetQoN.png" 
                  alt="Telegram Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
          <p className="mt-3 text-gray-600">
            Connect your Solana wallet to access your account
          </p>
        </div>
        
        <div className="mt-8 flex flex-col items-center space-y-4">
          <WalletMultiButton className="wallet-adapter-button-custom" />
          
          {connected && !isSignedIn && !isVerifying && needsVerification && (
            <button
              onClick={handleVerify}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Verify Wallet Ownership
            </button>
          )}
          
          {isVerifying && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-600">Verifying wallet ownership...</p>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-red-500">
              {error}. Please try again.
            </p>
          )}
          
          {connected && isLoading && (
            <p className="text-sm text-gray-600">
              Wallet connected! Loading your profile...
            </p>
          )}
          
          {connected && isSignedIn && !isLoading && (
            <p className="text-sm text-green-600">
              Authenticated successfully! Redirecting...
            </p>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
