import { supabase } from './supabase';

export async function fixUserMetadata(userId: string) {
  console.log('Fixing metadata for user:', userId);
  
  try {
    // First check if the user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return { success: false, error: userError };
    }
    
    console.log('User found:', user);
    
    // Check if metadata exists
    const { data: metadata, error: metadataError } = await supabase
      .from('user_public_metadata')
      .select('*')
      .eq('user_id', userId);
    
    if (metadataError && metadataError.code !== 'PGRST116') {
      console.error('Error fetching metadata:', metadataError);
      return { success: false, error: metadataError };
    }
    
    console.log('Existing metadata:', metadata);
    
    // If no metadata exists, create it
    if (!metadata || metadata.length === 0) {
      console.log('Creating new metadata record');
      
      const { data: newMetadata, error: insertError } = await supabase
        .from('user_public_metadata')
        .insert({
          user_id: userId,
          payments: [],
          websites: [],
          total_spent: 0,
          total_generated: 0
        })
        .select();
      
      if (insertError) {
        console.error('Error creating metadata:', insertError);
        return { success: false, error: insertError };
      }
      
      console.log('New metadata created:', newMetadata);
      return { success: true, data: newMetadata };
    }
    
    return { success: true, data: metadata };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
}
