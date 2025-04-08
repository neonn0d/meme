import { PublicKey, Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { createClient } from '@supabase/supabase-js';

// Constants
export const PAYMENT_AMOUNTS = {
  WEBSITE_GENERATION: 0.001, // SOL
  MONTHLY_SUBSCRIPTION: 0.01, // SOL
  YEARLY_SUBSCRIPTION: 0.1, // SOL
};

// Payment recipient wallet address
export const PAYMENT_RECIPIENT = new PublicKey(
  process.env.NEXT_PUBLIC_PAYMENT_WALLET || 'DRtXHDgC312wpNdNCSb8vCoXDcofCJcPHdAX1cQGrLV9'
);

// Solana connection
export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
);

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Payment types
export type PaymentType = 'website' | 'subscription';
export type SubscriptionPlan = 'monthly' | 'yearly';

// Payment interface
export interface PaymentResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * Process a payment using Solana
 */
export async function processPayment(
  wallet: WalletContextState,
  paymentType: PaymentType,
  plan?: SubscriptionPlan
): Promise<PaymentResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return { success: false, error: 'Wallet not connected' };
    }

    // Get payment amount based on type
    const amount = getPaymentAmount(paymentType, plan);
    console.log(`Processing ${paymentType} payment for ${amount} SOL`);

    // Create transaction
    const { blockhash } = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      recentBlockhash: blockhash,
    });

    // Add transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: PAYMENT_RECIPIENT,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Sign and send transaction
    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    console.log('Transaction sent with signature:', signature);
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature);
    
    if (confirmation.value.err) {
      console.error('Transaction confirmation error:', confirmation.value.err);
      return { success: false, error: 'Transaction failed to confirm' };
    }
    
    console.log('Transaction confirmed');
    
    // Record payment in database
    const recordResult = await recordPayment(
      wallet.publicKey.toString(),
      amount,
      signature,
      paymentType,
      plan
    );
    
    if (!recordResult.success) {
      console.error('Failed to record payment:', recordResult.error);
      return { success: true, signature, error: 'Transaction successful but failed to record in database' };
    }
    
    return { success: true, signature };
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return { success: false, error: error.message || 'Unknown payment error' };
  }
}

/**
 * Get payment amount based on type and plan
 */
function getPaymentAmount(paymentType: PaymentType, plan?: SubscriptionPlan): number {
  if (paymentType === 'website') {
    return PAYMENT_AMOUNTS.WEBSITE_GENERATION;
  } else if (paymentType === 'subscription') {
    return plan === 'yearly' 
      ? PAYMENT_AMOUNTS.YEARLY_SUBSCRIPTION 
      : PAYMENT_AMOUNTS.MONTHLY_SUBSCRIPTION;
  }
  return 0;
}

/**
 * Record payment in database
 */
async function recordPayment(
  walletAddress: string,
  amount: number,
  transactionHash: string,
  paymentType: PaymentType,
  plan?: SubscriptionPlan
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Find user by wallet address
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress);
    
    if (userError) {
      throw new Error(`Error finding user: ${userError.message}`);
    }
    
    if (!users || users.length === 0) {
      throw new Error('User not found');
    }
    
    const userId = users[0].id;
    
    // 2. Update user_public_metadata
    const { error: metadataError } = await supabase
      .from('user_public_metadata')
      .update({
        total_spent: supabase.rpc('increment_value', { 
          row_id: userId, 
          table_name: 'user_public_metadata',
          column_name: 'total_spent',
          increment_amount: amount
        })
      })
      .eq('user_id', userId);
    
    if (metadataError) {
      throw new Error(`Error updating metadata: ${metadataError.message}`);
    }
    
    // 3. Handle payment type specific actions
    if (paymentType === 'website') {
      // Increment website count
      const { error: websiteCountError } = await supabase
        .from('user_public_metadata')
        .update({
          total_generated: supabase.rpc('increment_value', { 
            row_id: userId, 
            table_name: 'user_public_metadata',
            column_name: 'total_generated',
            increment_amount: 1
          })
        })
        .eq('user_id', userId);
      
      if (websiteCountError) {
        throw new Error(`Error updating website count: ${websiteCountError.message}`);
      }
    } else if (paymentType === 'subscription') {
      // Create or update subscription
      const periodDays = plan === 'yearly' ? 365 : 30;
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + periodDays);
      
      // Check if subscription exists
      const { data: existingSub, error: subQueryError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (subQueryError && subQueryError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw new Error(`Error checking subscription: ${subQueryError.message}`);
      }
      
      if (existingSub) {
        // Update existing subscription
        const { error: updateSubError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            plan: plan || 'monthly',
            current_period_start: now.toISOString(),
            current_period_end: endDate.toISOString(),
            cancel_at_period_end: false,
            updated_at: now.toISOString()
          })
          .eq('id', existingSub.id);
        
        if (updateSubError) {
          throw new Error(`Error updating subscription: ${updateSubError.message}`);
        }
      } else {
        // Create new subscription
        const { error: createSubError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            status: 'active',
            plan: plan || 'monthly',
            current_period_start: now.toISOString(),
            current_period_end: endDate.toISOString(),
            cancel_at_period_end: false
          });
        
        if (createSubError) {
          throw new Error(`Error creating subscription: ${createSubError.message}`);
        }
      }
    }
    
    // 4. Record the payment in payments array
    const paymentData = {
      type: paymentType,
      amount: amount,
      status: 'completed',
      network: 'solana',
      timestamp: Date.now(),
      transaction_hash: transactionHash,
      ...(plan ? { plan } : {})
    };
    
    const { error: paymentError } = await supabase.rpc('add_payment_to_user', {
      user_id_param: userId,
      payment_data: paymentData
    });
    
    if (paymentError) {
      throw new Error(`Error recording payment: ${paymentError.message}`);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error recording payment:', error);
    return { success: false, error: error.message };
  }
}
