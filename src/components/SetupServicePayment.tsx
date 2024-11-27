'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MERCHANT_WALLET = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET!);
const NETWORK = 'mainnet-beta';
const SETUP_SERVICE_PRICE = Number(process.env.NEXT_PUBLIC_SETUP_SERVICE_PRICE!) || 0.2;

interface SetupServicePaymentProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function SetupServicePayment({ onSuccess, onClose }: SetupServicePaymentProps) {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT!,
        'confirmed'
      );

      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: MERCHANT_WALLET,
        lamports: LAMPORTS_PER_SOL * SETUP_SERVICE_PRICE
      });

      const transaction = new Transaction().add(instruction);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      toast.success('Payment successful! We will contact you shortly.');
      router.push('/setup-success');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Professional Setup Service</h3>
          <p className="text-gray-600 mt-2">Complete website deployment & configuration</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service Fee:</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-blue-600">{SETUP_SERVICE_PRICE}</span>
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
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <>
                  <span>Pay {SETUP_SERVICE_PRICE} SOL</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
            Solana Mainnet • Secure Payment
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 px-4 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Cancel
          </button>
        )}
      </motion.div>
    </div>
  );
}
