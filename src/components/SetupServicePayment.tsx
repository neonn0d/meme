'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SetupSuccess from './SetupSuccess';

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
  const [showSuccess, setShowSuccess] = useState(false);
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
      setShowSuccess(true);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return <SetupSuccess onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] shadow-xl relative flex flex-col"
      >
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Header - Fixed */}
        <div className="p-5 pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Professional Setup Service</h3>
            <p className="text-gray-600 text-sm">Let us handle your website deployment</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5">
          <div className="space-y-6">
            {/* Price Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-1">One-time Payment</p>
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-3xl font-bold text-purple-600">{SETUP_SERVICE_PRICE}</span>
                  <span className="text-xl font-semibold text-purple-600">SOL</span>
                </div>
              </div>
            </div>

            {/* Services Grid - Made more compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {/* Main Services */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Included Services:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Complete Website Deployment</p>
                      <p className="text-xs text-gray-600">Full setup on your chosen platform</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Domain Configuration</p>
                      <p className="text-xs text-gray-600">DNS setup and domain connection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">SSL Certificate</p>
                      <p className="text-xs text-gray-600">Secure HTTPS setup and verification</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Benefits */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Additional Benefits:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">24-hour Support</p>
                      <p className="text-xs text-gray-600">Direct assistance throughout setup</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Performance Optimization</p>
                      <p className="text-xs text-gray-600">Best practices implementation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Technical Guidance</p>
                      <p className="text-xs text-gray-600">Platform-specific recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prerequisites - Made more compact */}
            <div className="bg-yellow-50/50 p-3 rounded-xl border border-yellow-100 text-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Before Payment:</h4>
              <ul className="space-y-1.5 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  Purchase your domain from Namecheap or GoDaddy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  Create GitHub account (for Vercel/Netlify) OR hosting account
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  Have all login credentials ready
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Section - Fixed at bottom */}
        <div className="border-t border-gray-100 bg-white p-4 mt-auto rounded-b-2xl">
          <div className="space-y-3">
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>

            {publicKey && (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>Pay {SETUP_SERVICE_PRICE} SOL</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-600">Solana • Secure Payment</span>
              </div>
              <p className="text-xs text-gray-500">Contact us on social media after payment</p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
