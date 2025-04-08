'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowRight, LogOut, X, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';

const MERCHANT_WALLET = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET!);
const SOLANA_PRICE = Number(process.env.NEXT_PUBLIC_SOLANA_PRICE!) || 0.1;

interface SolanaPaymentProps {
  onSuccess: (paymentInfo: {
    paymentTx: string;
    paymentAmount: number;
    explorerUrl: string;
  }) => void;
  onClose: () => void;
  websiteDetails?: {
    coinName: string;
    tokenSymbol: string;
    contractAddress: string;
  };
}

export function SolanaPayment({ onSuccess, onClose, websiteDetails }: SolanaPaymentProps): JSX.Element {
  const { publicKey, sendTransaction, disconnect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { subscriptionData } = useSubscription();
  const isSubscribed = subscriptionData.isSubscribed;

  const getExplorerUrl = (hash: string): string => {
    return `https://explorer.solana.com/tx/${hash}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`;
  };

  useEffect(() => {
    const fetchSolanaPrice = async (): Promise<void> => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        const solUsdPrice = data.solana.usd;
        setUsdPrice(solUsdPrice * SOLANA_PRICE);
      } catch (error) {
        console.error('Error fetching SOL price:', error);
      }
    };

    fetchSolanaPrice();
    const interval = setInterval(fetchSolanaPrice, 60000); // Update price every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // If user is premium, skip payment and call onSuccess
    if (isSubscribed) {
      onSuccess({
        paymentTx: '',
        paymentAmount: 0,
        explorerUrl: ''
      });
      onClose();
    }
  }, [isSubscribed, onSuccess, onClose]);

  const handlePayment = async (): Promise<void> => {
    setPaymentStatus('idle');
    setTransactionHash(null);
    setErrorMessage(null);

    // If user is premium, skip payment and recording
    if (isSubscribed) {
      onSuccess({
        paymentTx: '',
        paymentAmount: 0,
        explorerUrl: ''
      });
      onClose();
      return;
    }
    
    // Handle error cases
    if (!publicKey) {
      setErrorMessage('Please connect your wallet first.');
      setPaymentStatus('error');
      return;
    }
    
    setLoading(true);
    console.log('Initiating payment process...');
      
    // Use Chainstack's RPC endpoint
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    
    try {
      console.log('Creating transaction...');
      // Create an unsigned transaction
      const transaction = new Transaction();
      
      // Add the transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: MERCHANT_WALLET,
          lamports: LAMPORTS_PER_SOL * SOLANA_PRICE
        })
      );
      
      console.log('Getting latest blockhash...');
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      console.log('Sending transaction using Phantom\'s signAndSendTransaction...');
      // Use the recommended signAndSendTransaction method from Phantom
      // This avoids the "malicious dApp" warning
      // @ts-ignore - Phantom types are not included in the default TypeScript definitions
      const provider = window.phantom?.solana;
      
      if (!provider) {
        throw new Error("Phantom wallet not found");
      }
      
      const { signature } = await provider.signAndSendTransaction(transaction);
      const explorerUrl = getExplorerUrl(signature);
      setTransactionHash(signature);
      console.log('Transaction sent, signature:', signature);
      console.log('Explorer URL:', explorerUrl);
      
      console.log('Confirming transaction...');
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        console.error('Transaction error:', confirmation.value.err);
        throw new Error('Transaction failed');
      }

      console.log('Transaction confirmed successfully');
      setPaymentStatus('success');
      toast.success('Payment successful!');
      
      // Record website generation
      try {
        const response = await fetch('/api/websites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicKey.toString()}`
          },
          body: JSON.stringify({
            hash: signature,
            price: SOLANA_PRICE,
            isPremium: false,
            explorerUrl: explorerUrl,
            ...(websiteDetails || {})
          })
        });

        if (!response.ok) {
          console.error('Failed to record website generation');
        }
      } catch (error) {
        console.error('Error recording website generation:', error);
      }
      
      // Wait a moment to show success state before closing
      setTimeout(() => {
        // Pass payment information to the onSuccess callback
        onSuccess({
          paymentTx: signature,
          paymentAmount: SOLANA_PRICE,
          explorerUrl: explorerUrl
        });
        router.push('/success');
      }, 2000);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      if (error.message?.includes('insufficient funds')) {
        setErrorMessage('Insufficient funds in wallet. Please add more SOL and try again.');
        toast.error('Insufficient funds in wallet. Please add more SOL and try again.');
      } else if (error.message?.includes('User rejected')) {
        setErrorMessage('Transaction was rejected by the user.');
        toast.error('Transaction was cancelled.');
      } else {
        setErrorMessage('Payment failed. Please try again.');
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative border border-gray-100"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Complete Payment</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentStatus === 'success' ? (
          <div className="text-center py-4">
            <div className="rounded-full bg-green-50 p-4 border border-green-100 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h3>
            <p className="text-sm text-gray-600 mb-4">Your transaction has been confirmed on the Solana blockchain.</p>
            {transactionHash && (
              <a 
                href={getExplorerUrl(transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm inline-flex items-center"
              >
                View on Solana Explorer
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4"
              >
                Continue
              </button>
            </div>
          </div>
        ) : paymentStatus === 'error' ? (
          <div className="text-center py-4">
            <div className="rounded-full bg-red-50 p-4 border border-red-100 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Failed</h3>
            <p className="text-sm text-gray-600 mb-4">{errorMessage || 'There was an issue processing your transaction. Please try again.'}</p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">Payment Amount</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{SOLANA_PRICE} SOL</p>
                  {usdPrice && <p className="text-xs text-gray-500 mt-0.5">≈ ${usdPrice.toFixed(2)} USD</p>}
                </div>
                <img src="/solana.svg" alt="Solana" className="h-8 w-8" />
              </div>
            </div>

            {!publicKey ? (
              <div className="mb-6">
                <p className="text-gray-700 mb-3 text-sm">Connect your wallet to continue:</p>
                <div className="flex justify-center">
                  <WalletMultiButton />
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 mb-5">
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm font-medium">Wallet connected</p>
                      <p className="text-xs font-mono">{publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-100/50 transition-colors"
                    title="Disconnect wallet"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors text-sm font-medium ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </div>
                  ) : (
                    <>
                      Complete Payment <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              By completing this payment, you agree to our Terms of Service and Privacy Policy.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
