import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/AuthContext';
import { createSignatureMessage, encodeSignature } from '@/lib/auth-utils';

interface VerifySignatureResponse {
  success: boolean;
  verified: boolean;
  user: any;
  error?: string;
}

export function useWalletAuth() {
  const { publicKey, signMessage } = useWallet();
  const { refreshUserProfile } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyWallet = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setError('Wallet not connected or does not support signing');
      return false;
    }

    try {
      setIsVerifying(true);
      setError(null);
      
      // Create a message for the user to sign
      const walletAddress = publicKey.toString();
      const message = await createSignatureMessage(walletAddress);
      
      // Request signature from wallet
      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);
      
      // Encode signature to base58 for transmission
      const encodedSignature = encodeSignature(signature);
      
      // Send to our API for verification
      const response = await fetch('/api/auth/verify-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          signature: encodedSignature,
          message,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify signature');
      }
      
      const data: VerifySignatureResponse = await response.json();
      
      if (data.success && data.verified) {
        // Refresh user profile after successful verification
        await refreshUserProfile();
        return true;
      } else {
        throw new Error('Signature verification failed');
      }
    } catch (err: any) {
      console.error('Error verifying wallet signature:', err);
      setError(err.message || 'Failed to verify wallet');
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [publicKey, signMessage, refreshUserProfile]);

  return {
    verifyWallet,
    isVerifying,
    error,
  };
}
