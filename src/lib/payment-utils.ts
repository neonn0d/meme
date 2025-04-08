import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { supabase } from './supabase';

// Payment recipient wallet (your business wallet)
// Use a placeholder key if the environment variable isn't set (for development only)
const DEFAULT_PAYMENT_WALLET = 'DRtXHDgC312wpNdNCSb8vCoXDcofCJcPHdAX1cQGrLV9';
export const PAYMENT_RECIPIENT = new PublicKey(
  process.env.NEXT_PUBLIC_PAYMENT_WALLET || DEFAULT_PAYMENT_WALLET
);

// Solana connection
export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
);

// Payment amounts - using smaller amounts for devnet testing
export const PAYMENT_AMOUNTS = {
  WEBSITE_GENERATION: 0.001, // SOL - small amount for testing
  MONTHLY_SUBSCRIPTION: 0.002, // SOL - small amount for testing
  YEARLY_SUBSCRIPTION: 0.005, // SOL - small amount for testing
};

/**
 * Create a payment transaction
 * @param amount Amount in SOL
 * @param fromWallet Sender's wallet public key
 * @param reference Reference public key for tracking
 * @returns Transaction object
 */
export async function createPaymentTransaction(
  amount: number,
  fromWallet: PublicKey,
  reference: PublicKey
) {
  console.log('Creating payment transaction:');
  console.log('- From wallet:', fromWallet.toString());
  console.log('- To wallet:', PAYMENT_RECIPIENT.toString());
  console.log('- Amount:', amount, 'SOL');
  console.log('- Reference:', reference.toString());
  
  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  console.log('- Using blockhash:', blockhash);
  
  // Create transaction
  const transaction = new Transaction({
    feePayer: fromWallet,
    recentBlockhash: blockhash,
  });
  
  // Add transfer instruction with a very small amount for testing
  // Convert to lamports (1 SOL = 1,000,000,000 lamports)
  const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
  console.log('- Lamports:', lamports);
  
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromWallet,
      toPubkey: PAYMENT_RECIPIENT,
      lamports: lamports,
    })
  );
  
  // Add reference instruction (for payment tracking)
  transaction.add(
    new TransactionInstruction({
      keys: [
        { pubkey: reference, isSigner: false, isWritable: false },
        { pubkey: fromWallet, isSigner: true, isWritable: false },
      ],
      data: Buffer.from([]),
      programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    })
  );
  
  return transaction;
}

/**
 * Record a payment in the database
 * @param userId User ID
 * @param amount Amount in SOL
 * @param signature Transaction signature
 * @param paymentType Type of payment (website or subscription)
 * @param metadata Additional metadata
 * @returns Success status and any error
 */
export async function recordPayment(
  userId: string,
  amount: number,
  signature: string,
  paymentType: 'website' | 'subscription',
  metadata: any = {}
) {
  try {
    // Record payment in user's public metadata
    const { data: userMeta, error: fetchError } = await supabase
      .from('user_public_metadata')
      .select('payments, total_spent')
      .eq('user_id', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching user metadata:', fetchError);
      return { success: false, error: fetchError };
    }
    
    const payments = userMeta.payments || [];
    const totalSpent = userMeta.total_spent || 0;
    
    const newPayment = {
      id: signature,
      amount,
      timestamp: new Date().toISOString(),
      type: paymentType,
      ...metadata,
    };
    
    const { error: updateError } = await supabase
      .from('user_public_metadata')
      .update({
        payments: [...payments, newPayment],
        total_spent: totalSpent + amount,
      })
      .eq('user_id', userId);
      
    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return { success: false, error: updateError };
    }
    
    // If it's a subscription payment, create or update subscription
    if (paymentType === 'subscription') {
      const periodEnd = new Date();
      if (metadata.plan === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else if (metadata.plan === 'yearly') {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }
      
      // Check if subscription exists
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (existingSub) {
        // Update existing subscription
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: periodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSub.id);
      } else {
        // Create new subscription
        await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            status: 'active',
            plan: metadata.plan,
            current_period_end: periodEnd.toISOString(),
          });
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error recording payment:', error);
    return { success: false, error };
  }
}

/**
 * Verify a transaction on the Solana blockchain
 * @param signature Transaction signature
 * @returns Verification status and transaction details
 */
export async function verifyTransaction(signature: string) {
  try {
    // Get transaction details
    const tx = await connection.getTransaction(signature, {
      commitment: 'confirmed',
    });
    
    if (!tx) {
      return { verified: false, error: 'Transaction not found' };
    }
    
    // Check if transaction is successful
    if (tx.meta?.err) {
      return { verified: false, error: 'Transaction failed' };
    }
    
    return { verified: true, transaction: tx };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return { verified: false, error };
  }
}

/**
 * Sign and send a transaction
 * @param transaction Transaction to sign and send
 * @param wallet Wallet to sign with
 * @returns Transaction signature and success status
 */
export async function signAndSendTransaction(
  transaction: Transaction,
  wallet: WalletContextState
) {
  if (!wallet.signTransaction) {
    throw new Error('Wallet does not support transaction signing');
  }
  
  try {
    // Sign transaction
    const signedTransaction = await wallet.signTransaction(transaction);
    
    // Send transaction
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    
    // Confirm transaction
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
    }
    
    return { signature, success: true };
  } catch (error) {
    console.error('Error signing and sending transaction:', error);
    throw error;
  }
}

/**
 * Generate a random payment reference
 * @returns Random public key for reference
 */
export function generatePaymentReference() {
  return new PublicKey(crypto.randomUUID().replace(/-/g, ''));
}

/**
 * Wait for a transaction to be confirmed
 * @param signature Transaction signature
 * @param timeout Timeout in milliseconds
 * @returns Confirmation status and any error
 */
export async function waitForTransactionConfirmation(signature: string, timeout = 60000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const status = await connection.getSignatureStatus(signature);
      
      if (status && status.value) {
        if (status.value.err) {
          return { confirmed: false, error: status.value.err };
        }
        
        if (status.value.confirmationStatus === 'confirmed' || 
            status.value.confirmationStatus === 'finalized') {
          return { confirmed: true };
        }
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error checking transaction status:', error);
      // Continue trying
    }
  }
  
  return { confirmed: false, error: 'Timeout' };
}
