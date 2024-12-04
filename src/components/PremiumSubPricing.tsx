'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { useUser } from '@clerk/nextjs';
import { PaymentRecord } from '@/types/payment';

const MERCHANT_WALLET = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET!);
const PREMIUM_AMOUNT = Number(process.env.NEXT_PUBLIC_PREMIUM_AMOUNT!) || 0.0017;
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

interface PremiumSubPricingProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function PremiumSubPricing({ onSuccess, onClose }: PremiumSubPricingProps) {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSubscribed } = useSubscription();
  const { user } = useUser();

  const calculateExpiryDate = (startDate: number): number => {
    const startDateTime = new Date(startDate);
    const expiryDateTime = new Date(startDate);
    expiryDateTime.setMonth(expiryDateTime.getMonth() + 1);
    
    const startDay = startDateTime.getDate();
    const lastDayOfNextMonth = new Date(
      expiryDateTime.getFullYear(),
      expiryDateTime.getMonth() + 1,
      0
    ).getDate();
    
    if (startDay > lastDayOfNextMonth) {
      expiryDateTime.setDate(lastDayOfNextMonth);
    }
    
    return expiryDateTime.getTime();
  };

  const recordPayment = async (hash: string) => {
    try {
      const timestamp = Date.now();
      const payment: PaymentRecord = {
        amount: PREMIUM_AMOUNT,
        timestamp,
        type: 'premium',
        transactionHash: hash,
        status: 'completed',
        network: NETWORK,
        expiryDate: calculateExpiryDate(timestamp)
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment }),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }
    } catch (err) {
      console.error('Error recording payment:', err);
      throw new Error('Failed to record payment metadata');
    }
  };

  useEffect(() => {
    if (isSubscribed) {
      onSuccess();
      onClose();
    }
  }, [isSubscribed, onSuccess, onClose]);

  const handlePayment = async () => {
    if (isSubscribed) {
      onSuccess();
      onClose();
      return;
    }

    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      console.log('Initiating premium subscription payment...');
      
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT!,
        'confirmed'
      );

      console.log('Creating transaction...');
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: MERCHANT_WALLET,
        lamports: LAMPORTS_PER_SOL * PREMIUM_AMOUNT
      });

      const transaction = new Transaction().add(instruction);
      console.log('Getting latest blockhash...');
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      console.log('Sending transaction...');
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction sent, signature:', signature);
      
      console.log('Confirming transaction...');
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        console.error('Transaction error:', confirmation.value.err);
        throw new Error('Transaction failed');
      }

      console.log('Transaction confirmed successfully');
      
      // Record the payment metadata
      await recordPayment(signature);
      
      toast.success('Premium subscription payment successful!');
      onSuccess();
      
      // Redirect to history page
      router.push('/history');
    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient funds in wallet. Please add more SOL and try again.');
      } else if (error.message?.includes('User rejected')) {
        toast.error('Transaction was cancelled.');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h3>
          <p className="text-gray-600 mt-2">Get access to exclusive features and unlimited generations</p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Premium Subscription:</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-blue-600">{PREMIUM_AMOUNT}</span>
                <span className="text-lg font-semibold text-blue-600">SOL</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
          {publicKey && (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <>
                  <span>Pay {PREMIUM_AMOUNT} SOL for Premium</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-400">
              Solana • Secure Payment
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
