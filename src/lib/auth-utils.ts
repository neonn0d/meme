import { supabase } from './supabase';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

/**
 * Check if a user has an active subscription
 * @param userId The user ID to check
 * @returns Object containing subscription status and details
 */
export async function getSubscriptionStatus(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  if (error || !data) {
    return { isSubscribed: false };
  }
  
  const now = new Date();
  const periodEnd = new Date(data.current_period_end);
  
  return {
    isSubscribed: periodEnd > now,
    subscription: data
  };
}

/**
 * Update a user's public metadata
 * @param userId The user ID to update
 * @param metadata The metadata to update
 * @returns Object containing success status and any error
 */
export async function updateUserMetadata(userId: string, metadata: any) {
  const { error } = await supabase
    .from('user_public_metadata')
    .update(metadata)
    .eq('user_id', userId);
    
  return { success: !error, error };
}

/**
 * Verify a signature against a message and public key
 * @param message The message that was signed
 * @param signature The signature to verify
 * @param publicKey The public key to verify against
 * @returns True if the signature is valid
 */
export function verifySignature(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
  return nacl.sign.detached.verify(message, signature, publicKey);
}

/**
 * Create a message for the user to sign for authentication
 * @param walletAddress The wallet address of the user
 * @returns A message string to be signed
 */
export async function createSignatureMessage(walletAddress: string): Promise<string> {
  const timestamp = Date.now();
  return `Sign this message to authenticate with our app: ${walletAddress} ${timestamp}`;
}

/**
 * Parse a base58 encoded signature string to Uint8Array
 * @param signatureString The base58 encoded signature
 * @returns The signature as a Uint8Array
 */
export function parseSignature(signatureString: string): Uint8Array {
  return bs58.decode(signatureString);
}

/**
 * Encode a Uint8Array signature to a base58 string
 * @param signature The signature as a Uint8Array
 * @returns The base58 encoded signature
 */
export function encodeSignature(signature: Uint8Array): string {
  return bs58.encode(signature);
}

/**
 * Validate a Solana wallet address
 * @param address The wallet address to validate
 * @returns True if the address is valid
 */
export function isValidWalletAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}
