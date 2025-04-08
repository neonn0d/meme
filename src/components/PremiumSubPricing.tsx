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
import { useAuth } from '@/contexts/AuthContext';
import { PaymentRecord } from '@/types/payment';
import { LogOut } from 'lucide-react';

const MERCHANT_WALLET = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET || 'DRtXHDgC312wpNdNCSb8vCoXDcofCJcPHdAX1cQGrLV9');
const PREMIUM_AMOUNT = Number(process.env.NEXT_PUBLIC_PREMIUM_AMOUNT!) || 0.0017;
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

interface PremiumSubPricingProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function PremiumSubPricing({ onSuccess, onClose }: PremiumSubPricingProps) {
  const { publicKey, sendTransaction, disconnect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { subscriptionData } = useSubscription();
  const isSubscribed = subscriptionData.isSubscribed;
  const { userProfile } = useAuth();

  const getExplorerUrl = (hash: string) => {
    return `https://explorer.solana.com/tx/${hash}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK}`;
  };

  useEffect(() => {
    const fetchSolanaPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        const solUsdPrice = data.solana.usd;
        setUsdPrice(solUsdPrice * PREMIUM_AMOUNT);
      } catch (error) {
        console.error('Error fetching SOL price:', error);
      }
    };

    fetchSolanaPrice();
    const interval = setInterval(fetchSolanaPrice, 60000); // Update price every minute
    return () => clearInterval(interval);
  }, []);

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
      const payment = {
        amount: PREMIUM_AMOUNT,
        transactionHash: hash,
        network: NETWORK
      };

      console.log('Recording subscription payment:', payment);
      
      // Get wallet address to include in authorization header
      const walletAddress = publicKey?.toString();
      if (!walletAddress) {
        throw new Error('Wallet address not available');
      }

      // Simple direct API call with wallet address in Authorization header
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${walletAddress}`
        },
        body: JSON.stringify({ payment })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Payment API error response:', responseData);
        throw new Error(responseData.error || 'Failed to record payment');
      }
      
      console.log('Payment recorded successfully:', responseData);
      return responseData;
    } catch (err) {
      console.error('Error recording payment:', err);
      throw new Error(`Failed to record payment metadata: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (isSubscribed) {
      onSuccess();
      onClose();
    }
  }, [isSubscribed, onSuccess, onClose]);

  const handlePayment = async () => {
    setPaymentStatus('idle');
    setTransactionHash(null);
    setErrorMessage(null);

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
      
      console.log('Using RPC endpoint:', RPC_ENDPOINT);
      const connection = new Connection(
        RPC_ENDPOINT,
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
      
      // Record the payment metadata
      await recordPayment(signature);
      
      setPaymentStatus('success');
      toast.success('Premium subscription payment successful!');

      // Wait a moment to show success state before closing
      setTimeout(() => {
        onSuccess();
        router.push('/dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setPaymentStatus('error');
      
      if (error.message?.includes('insufficient funds')) {
        setErrorMessage('Insufficient funds in wallet. Please add more SOL and try again.');
        toast.error('Insufficient funds in wallet. Please add more SOL and try again.');
      } else if (error.message?.includes('User rejected')) {
        setErrorMessage('Transaction was cancelled.');
        toast.error('Transaction was cancelled.');
      } else if (error.message?.includes('metadata')) {
        // This is specifically for the payment recording error
        setErrorMessage(`Payment failed: ${error.message}`);
        toast.error(`Transaction completed but failed to record payment: ${error.message}`);
      } else {
        setErrorMessage(`Payment failed: ${error.message || 'Unknown error'}. Please try again.`);
        toast.error(`Payment failed: ${error.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-b from-white to-gray-50/90 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-white/20"
      >
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white w-10 h-10 rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border border-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Premium Subscription</h3>
          <p className="text-gray-500 mt-2 text-sm">Get unlimited access to all features</p>
        </motion.div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl space-y-3 shadow-lg border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-400">Monthly Fee</span>
                <div className="flex items-baseline space-x-2">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{PREMIUM_AMOUNT}</span>
                    <span className="text-lg font-semibold text-blue-600 ml-1">SOL</span>
                  </div>
                  {usdPrice && (
                    <span className="text-sm text-gray-400">≈ ${usdPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <div className="bg-blue-50 p-2 rounded-xl">
                <img src="/solana.svg" alt="Solana" className="w-8 h-8" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center space-y-4"
          >
            {!publicKey ? (
              <div className='flex flex-col space-y-4 items-center justify-center w-full mx-auto'>
                <div className="">
                  <WalletMultiButton className="walletButton" />
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-sm text-gray-400">Connect wallet to continue</p>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-4">
                {paymentStatus === 'success' ? (
                  <div className="bg-white p-6 rounded-2xl space-y-4 shadow-lg border border-green-100">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-50 rounded-full">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      >
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Premium Activated!</h3>
                      <p className="text-sm text-gray-500">Your premium subscription is now active</p>
                      {transactionHash && (
                        <a
                          href={getExplorerUrl(transactionHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 break-all"
                        >
                          View transaction: {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
                        </a>
                      )}
                    </div>
                  </div>
                ) : paymentStatus === 'error' ? (
                  <div className="bg-white p-6 rounded-2xl space-y-4 shadow-lg border border-red-100">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-50 rounded-full">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      >
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Payment Failed</h3>
                      <p className="text-sm text-red-500">{errorMessage}</p>
                      {transactionHash && (
                        <a
                          href={getExplorerUrl(transactionHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 break-all"
                        >
                          View transaction: {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setPaymentStatus('idle');
                          setErrorMessage(null);
                        }}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 h-[52px] font-medium shadow-lg"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                          <span className="text-sm">Processing...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm">Pay {PREMIUM_AMOUNT} SOL</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <button
                      onClick={disconnect}
                      className="w-full bg-gray-100 text-gray-600 py-4 px-6 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 h-[52px] text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-400 flex items-center justify-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            <span>Secure Payment via Solana</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
