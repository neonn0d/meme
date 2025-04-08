import { StringSession } from 'telegram/sessions';
import { supabase, supabaseAdmin } from './supabase';

// Function to save session to Supabase user_private_metadata table
export const saveSessionToSupabase = async (
  userId: string, 
  phoneNumber: string, 
  sessionString: string,
  userInfo?: any
): Promise<void> => {
  try {
    console.log(`Saving Telegram session to Supabase for userId: ${userId}, phone: ${phoneNumber}`);
    
    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return;
    }
    
    // First, get the current telegram_sessions array
    const { data: privateMetadata, error: fetchError } = await supabaseAdmin
      .from('user_private_metadata')
      .select('telegram_sessions')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user_private_metadata:', fetchError);
      throw fetchError;
    }
    
    // Get existing telegram sessions or create an empty array
    const telegramSessions = privateMetadata?.telegram_sessions || [];
    console.log(`Found ${telegramSessions.length} existing Telegram sessions in Supabase`);
    
    // Check if a session with this phone number already exists
    const existingSessionIndex = telegramSessions.findIndex((s: any) => s.phone === phoneNumber);
    
    // Optimize userInfo to reduce size if it exists
    let optimizedUserInfo: Record<string, any> | null = null;
    if (userInfo) {
      // Create a copy of userInfo with only essential fields
      optimizedUserInfo = {
        id: userInfo.id,
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        username: userInfo.username || '',
        phone: userInfo.phone || phoneNumber,
        premium: userInfo.premium || false,
        verified: userInfo.verified || false
      };
      
      // Handle photo separately if needed
      if (userInfo.photo) {
        try {
          // Just indicate that a photo exists to save space
          optimizedUserInfo.hasPhoto = true;
        } catch (photoError) {
          console.error('Error processing photo:', photoError);
        }
      }
    }
    
    // Create new session object with optimized userInfo if provided
    const sessionObject = {
      phone: phoneNumber,
      session: sessionString,
      created: new Date().toISOString(),
      ...(optimizedUserInfo ? { userInfo: optimizedUserInfo } : {})
    };
    
    // Update the sessions array
    const updatedSessions = [...telegramSessions];
    if (existingSessionIndex !== -1) {
      updatedSessions[existingSessionIndex] = {
        ...updatedSessions[existingSessionIndex],
        ...sessionObject
      };
    } else {
      updatedSessions.push(sessionObject);
    }
    
    // If we don't have a record yet, create one
    if (!privateMetadata) {
      const { error: insertError } = await supabaseAdmin
        .from('user_private_metadata')
        .insert({
          user_id: userId,
          telegram_sessions: updatedSessions
        });
      
      if (insertError) {
        console.error('Error creating user_private_metadata record:', insertError);
        throw insertError;
      }
    } else {
      // Update the existing record
      const { error: updateError } = await supabaseAdmin
        .from('user_private_metadata')
        .update({
          telegram_sessions: updatedSessions
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating user_private_metadata record:', updateError);
        throw updateError;
      }
    }
    
    console.log(`Successfully saved Telegram session to Supabase for ${phoneNumber}`);
  } catch (error) {
    console.error('Error saving Telegram session to Supabase:', error);
    throw error;
  }
};

// Function to get available sessions from Supabase
export const getSessionsFromSupabase = async (userId: string) => {
  console.log('getSessionsFromSupabase called for user ID:', userId);
  
  if (!supabaseAdmin) {
    console.error('Supabase admin client not available');
    return [];
  }
  
  try {
    console.log('Fetching telegram_sessions from user_private_metadata table');
    
    // Directly query the user_private_metadata table
    const { data: privateMetadata, error } = await supabaseAdmin
      .from('user_private_metadata')
      .select('telegram_sessions')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user_private_metadata:', error);
      // Log more details for debugging
      console.log('Error details:', JSON.stringify(error));
      return [];
    }
    
    if (!privateMetadata || !privateMetadata.telegram_sessions) {
      console.log('No telegram_sessions found for user:', userId);
      return [];
    }
    
    // Get telegram sessions
    const telegramSessions = privateMetadata.telegram_sessions;
    console.log('Telegram sessions found:', Array.isArray(telegramSessions) ? telegramSessions.length : 'Not an array');
    console.log('Sessions data type:', typeof telegramSessions);
    
    // Handle both array and object formats
    const sessionsArray = Array.isArray(telegramSessions) ? telegramSessions : [telegramSessions];
    
    // Return sessions with minimal info for the client
    return sessionsArray.map((session: any) => ({
      phone: session.phone,
      created: session.created,
      userInfo: session.userInfo || null
    }));
  } catch (error) {
    console.error('Error getting Telegram sessions from Supabase:', error);
    return [];
  }
};

// Function to get a specific session from Supabase
export const getSessionFromSupabase = async (userId: string, phoneNumber: string) => {
  try {
    console.log(`Getting session from Supabase for userId: ${userId}, phone: ${phoneNumber}`);
    
    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return null;
    }
    
    // Get the user's private metadata from Supabase using admin client to bypass RLS
    const { data: privateMetadata, error } = await supabaseAdmin
      .from('user_private_metadata')
      .select('telegram_sessions')
      .filter('user_id', 'eq', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user_private_metadata:', error);
      return null;
    }
    
    // Get telegram sessions or return null if none exist
    const telegramSessions = privateMetadata?.telegram_sessions || [];
    console.log(`Found ${telegramSessions.length} sessions in Supabase`);
    
    // Find the session with the matching phone number
    const session = telegramSessions.find((s: any) => s.phone === phoneNumber);
    console.log(`Session found for ${phoneNumber}: ${session ? 'Yes' : 'No'}`);
    
    return session;
  } catch (error) {
    console.error('Error getting Telegram session from Supabase:', error);
    return null;
  }
};

// Function to delete a session from Supabase
export const deleteSessionFromSupabase = async (userId: string, phoneNumber: string): Promise<boolean> => {
  try {
    console.log(`Deleting Telegram session from Supabase for userId: ${userId}, phone: ${phoneNumber}`);
    
    // Check if Supabase admin client is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return false;
    }
    
    // First, get the current telegram_sessions array
    const { data: privateMetadata, error: fetchError } = await supabaseAdmin
      .from('user_private_metadata')
      .select('telegram_sessions')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching user_private_metadata:', fetchError);
      return false;
    }
    
    // Get existing telegram sessions
    const telegramSessions = privateMetadata?.telegram_sessions || [];
    console.log(`Found ${telegramSessions.length} sessions in Supabase`);
    
    // Find the session with the matching phone number
    const sessionIndex = telegramSessions.findIndex((s: any) => s.phone === phoneNumber);
    
    if (sessionIndex === -1) {
      console.log(`No session found for ${phoneNumber}`);
      return false;
    }
    
    // Remove the session
    telegramSessions.splice(sessionIndex, 1);
    console.log(`Removed session for ${phoneNumber}`);
    
    // Update the user's private metadata using admin client to bypass RLS
    const { error: updateError } = await supabaseAdmin
      .from('user_private_metadata')
      .update({
        telegram_sessions: telegramSessions
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating user_private_metadata:', updateError);
      return false;
    }
    
    console.log(`Successfully updated user metadata after removing session`);
    return true;
  } catch (error) {
    console.error('Error deleting Telegram session from Supabase:', error);
    return false;
  }
};

// Helper to encrypt session info for client
export const encryptSessionInfo = (data: any) => {
  // Simple base64 encoding for now
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

// Helper to decrypt session info from client
export const decryptSessionInfo = (encryptedData: string) => {
  try {
    // Simple base64 decoding for now
    const decodedData = JSON.parse(Buffer.from(encryptedData, 'base64').toString());
    
    // Handle the case where the data is already in the expected format
    if (decodedData.phoneNumber && decodedData.phoneCodeHash && decodedData.stringSession) {
      return decodedData;
    }
    
    // Handle the case where the data is in a different format (from the example you provided)
    if (decodedData.sessionInfo) {
      // Try to parse the nested sessionInfo
      try {
        const nestedSessionInfo = JSON.parse(Buffer.from(decodedData.sessionInfo, 'base64').toString());
        return nestedSessionInfo;
      } catch (e) {
        // If parsing fails, return the original data
        return decodedData;
      }
    }
    
    return decodedData;
  } catch (error) {
    console.error('Error decrypting session info:', error);
    // If all else fails, try to parse the raw string
    try {
      return JSON.parse(encryptedData);
    } catch (e) {
      throw new Error('Failed to decrypt session info: Invalid format');
    }
  }
};

// Function to ensure emoji characters are properly encoded
export function encodeEmojiForStorage(text: string): string {
  if (!text) return '';
  
  // Use base64 encoding to preserve emoji characters
  return Buffer.from(text).toString('base64');
}

// Function to decode emoji characters from storage
export function decodeEmojiFromStorage(encodedText: string): string {
  if (!encodedText) return '';
  
  try {
    // Decode from base64
    return Buffer.from(encodedText, 'base64').toString();
  } catch (error) {
    console.error('Error decoding emoji text:', error);
    return encodedText; // Return original if decoding fails
  }
}
