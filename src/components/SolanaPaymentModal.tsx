'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAuth } from '@/contexts/AuthContext';
import { PAYMENT_AMOUNTS } from '@/lib/payment-utils';
import { supabase } from '@/lib/supabase';

interface SolanaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  paymentType: 'website' | 'subscription';
  plan?: 'monthly' | 'yearly';
}

export default function SolanaPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  paymentType,
  plan = 'monthly'
}: SolanaPaymentModalProps) {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const { userId } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  
  // Determine payment amount based on type and plan
  const getPaymentAmount = useCallback(() => {
    if (paymentType === 'website') {
      return PAYMENT_AMOUNTS.WEBSITE_GENERATION;
    } else if (paymentType === 'subscription') {
      return plan === 'monthly' 
        ? PAYMENT_AMOUNTS.MONTHLY_SUBSCRIPTION 
        : PAYMENT_AMOUNTS.YEARLY_SUBSCRIPTION;
    }
    return 0;
  }, [paymentType, plan]);
  
  // Create Solana connection
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
  );
  
  // Payment recipient address
  const PAYMENT_RECIPIENT = new PublicKey(
    process.env.NEXT_PUBLIC_PAYMENT_WALLET || 'DRtXHDgC312wpNdNCSb8vCoXDcofCJcPHdAX1cQGrLV9'
  );
  
  const handlePayment = async () => {
    if (!publicKey || !connected) {
      setError('Wallet not connected');
      return;
    }
    
    if (!userId) {
      setError('User not authenticated. Please refresh the page and try again.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const amount = getPaymentAmount();
      console.log('Making payment of', amount, 'SOL');
      
      // Create an unsigned transaction
      const transaction = new Transaction();
      
      // Add the transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: PAYMENT_RECIPIENT,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Use the recommended signAndSendTransaction method from Phantom
      // This avoids the "malicious dApp" warning
      // @ts-ignore - Phantom types are not included in the default TypeScript definitions
      const provider = window.phantom?.solana;
      
      if (!provider) {
        throw new Error("Phantom wallet not found");
      }
      
      const { signature } = await provider.signAndSendTransaction(transaction);
      console.log('Transaction sent with signature:', signature);
      setTransactionSignature(signature);
      
      // Update database based on payment type
      if (paymentType === 'subscription') {
        // Handle subscription payment
        console.log('Creating/updating subscription record');
        
        const periodDays = plan === 'yearly' ? 365 : 30;
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + periodDays);
        
        // Check if supabase client is available
        if (!supabase) {
          console.error('Database connection not available');
          throw new Error('Database connection not available');
        }
        
        // Create or update subscription record
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            status: 'active',
            plan: plan,
            current_period_start: now.toISOString(),
            current_period_end: endDate.toISOString(),
            cancel_at_period_end: false
          });
        
        if (subError) {
          console.error('Error updating subscription:', subError);
          throw new Error('Failed to update subscription');
        }
        
        console.log('Subscription updated successfully');
      } else if (paymentType === 'website') {
        // Handle website payment - increment website count
        console.log('Updating website count');
        
        // Check if supabase client is available
        if (!supabase) {
          console.error('Database connection not available');
          throw new Error('Database connection not available');
        }
        
        // Get current count
        const { data: metadata, error: fetchError } = await supabase
          .from('user_public_metadata')
          .select('total_generated')
          .eq('user_id', userId)
          .single();
        
        if (fetchError) {
          console.error('Error fetching metadata:', fetchError);
          throw new Error('Failed to fetch user metadata');
        }
        
        const currentCount = metadata?.total_generated || 0;
        
        // Check if supabase client is available
        if (!supabase) {
          console.error('Database connection not available');
          throw new Error('Database connection not available');
        }
        
        // Update count
        const { error: countError } = await supabase
          .from('user_public_metadata')
          .update({
            total_generated: currentCount + 1
          })
          .eq('user_id', userId);
        
        if (countError) {
          console.error('Error updating website count:', countError);
          throw new Error('Failed to update website count');
        }
        
        console.log('Website count updated successfully');
      }
      
      // Update payment history
      console.log('Updating payment history');
      
      // Check if supabase client is available
      if (!supabase) {
        console.error('Database connection not available');
        throw new Error('Database connection not available');
      }
      
      // Get current payments array and total_spent
      const { data: userData, error: userError } = await supabase
        .from('user_public_metadata')
        .select('payments, total_spent')
        .eq('user_id', userId)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        throw new Error('Failed to fetch user data');
      }
      
      // Create payment record
      const paymentData = {
        type: paymentType,
        amount: amount,
        status: 'completed',
        network: 'solana',
        timestamp: Date.now(),
        transaction_hash: signature,
        ...(paymentType === 'subscription' ? { plan } : {})
      };
      
      // Append to existing payments or create new array
      const currentPayments = userData?.payments || [];
      const updatedPayments = [...currentPayments, paymentData];
      
      // Check if supabase client is available
      if (!supabase) {
        console.error('Database connection not available');
        throw new Error('Database connection not available');
      }
      
      // Update payments array
      const { error: paymentError } = await supabase
        .from('user_public_metadata')
        .update({
          payments: updatedPayments,
          total_spent: (userData?.total_spent || 0) + amount
        })
        .eq('user_id', userId);
      
      if (paymentError) {
        console.error('Error updating payment history:', paymentError);
        throw new Error('Failed to update payment history');
      }
      
      console.log('Payment recorded successfully');
      
      // Call success callback
      onSuccess();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Complete Payment</h2>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-600 text-sm">
            {paymentType === 'website' 
              ? 'Payment for website generation' 
              : `Payment for ${plan} subscription`}
          </p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{getPaymentAmount()} SOL</p>
        </div>
        
        {!connected ? (
          <div className="mb-6">
            <p className="text-gray-700 mb-3 text-sm">Connect your wallet to continue:</p>
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
            <p className="font-medium text-sm">Wallet connected</p>
            <p className="text-xs mt-1 font-mono break-all">{publicKey?.toString()}</p>
          </div>
        )}
        
        {transactionSignature && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm text-green-700 font-medium">Transaction successful!</p>
            <p className="text-xs mt-1 font-mono break-all text-green-600">
              {transactionSignature}
            </p>
            <a 
              href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-xs mt-2 inline-block"
            >
              View on Solana Explorer
            </a>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
            <p className="font-medium text-sm">Error</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {connected && (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`px-4 py-2 text-sm rounded-lg ${isProcessing 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'}`}
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
