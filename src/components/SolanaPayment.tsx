'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';

const MERCHANT_WALLET = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET!);
const SOLANA_PRICE = Number(process.env.NEXT_PUBLIC_SOLANA_PRICE!) || 0.1;

interface SolanaPaymentProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function SolanaPayment({ onSuccess, onClose }: SolanaPaymentProps) {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSubscribed } = useSubscription();

  useEffect(() => {
    // If user is premium, skip payment and call onSuccess
    if (isSubscribed) {
      onSuccess();
      onClose();
    }
  }, [isSubscribed, onSuccess, onClose]);

  const handlePayment = async () => {
    // If user is premium, skip payment
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
      console.log('Initiating payment process...');
      
      // Use Chainstack's RPC endpoint
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT!,
        'confirmed'
      );

      console.log('Creating transaction...');
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: MERCHANT_WALLET,
        lamports: LAMPORTS_PER_SOL * SOLANA_PRICE
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
      toast.success('Payment successful!');
      onSuccess();
      
      // Redirect to success page
      router.push('/success');
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
          <h3 className="text-2xl font-bold text-gray-900">Ready to Generate?</h3>
          <p className="text-gray-600 mt-2">Complete the payment to generate and download your website</p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Generation Fee:</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-blue-600">{SOLANA_PRICE}</span>
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
                  <span>Pay {SOLANA_PRICE} SOL to Generate</span>
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
