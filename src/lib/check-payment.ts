import { supabase } from './supabase';

// Function to check if a payment exists for a user
export async function checkPaymentExists(userId: string) {
  console.log('Checking payments for user:', userId);
  
  // First check if the user exists
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', userId);
  
  if (userError) {
    console.error('Error fetching user by wallet address:', userError);
    return { success: false, error: userError };
  }
  
  if (!users || users.length === 0) {
    console.error('No user found with wallet address:', userId);
    return { success: false, error: 'User not found' };
  }
  
  console.log('Users found:', users);
  const user = users[0]; // Take the first user if multiple exist
  
  // Get the user's metadata
  const { data: metadata, error: metadataError } = await supabase
    .from('user_public_metadata')
    .select('*')
    .eq('user_id', user.id);
  
  if (metadataError) {
    console.error('Error fetching user metadata:', metadataError);
    return { success: false, error: metadataError };
  }
  
  console.log('User metadata:', metadata);
  
  return { success: true, data: { user, metadata } };
}
