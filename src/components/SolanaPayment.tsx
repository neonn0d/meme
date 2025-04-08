'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { X, ArrowRight, LogOut } from 'lucide-react';
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
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: MERCHANT_WALLET,
        lamports: LAMPORTS_PER_SOL * SOLANA_PRICE
      });

      // Create a new transaction (unsigned)
      const transaction = new Transaction();
      transaction.add(instruction);
      
      console.log('Getting latest blockhash...');
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      console.log('Sending transaction using Phantom-recommended method...');
      // Use the method that Phantom recommends to avoid security warnings
      // Send the transaction unsigned and let Phantom handle signing
      const signature = await sendTransaction(transaction, connection, { skipPreflight: false });
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
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </motion.button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Payment</h2>

        {paymentStatus === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Your transaction has been confirmed.</p>
            {transactionHash && (
              <a 
                href={getExplorerUrl(transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline text-sm"
              >
                View on Solana Explorer
              </a>
            )}
          </div>
        ) : paymentStatus === 'error' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-4">{errorMessage || 'There was an error processing your payment.'}</p>
            <button
              onClick={handlePayment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">Payment Amount</p>
                  <p className="text-2xl font-bold text-gray-800">{SOLANA_PRICE} SOL</p>
                  {usdPrice && <p className="text-sm text-gray-500">≈ ${usdPrice.toFixed(2)} USD</p>}
                </div>
                <img src="/solana.svg" alt="Solana" className="h-8 w-8" />
              </div>
            </div>

            {!publicKey ? (
              <div className="mb-6">
                <p className="text-gray-600 mb-4">Connect your wallet to continue with the payment.</p>
                <div className="flex justify-center">
                  <WalletMultiButton />
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Connected Wallet</p>
                      <p className="text-xs text-gray-500">{publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="text-gray-500 hover:text-gray-700"
                    title="Disconnect wallet"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-center transition-colors ${
                    loading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Pay with Solana <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            <p className="text-xs text-gray-500 text-center">
              By completing this payment, you agree to our Terms of Service and Privacy Policy.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
