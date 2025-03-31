import { StringSession } from 'telegram/sessions';
import { clerkClient } from '@clerk/nextjs';

// Function to save session to Clerk's private metadata
export const saveSessionToClerk = async (
  userId: string, 
  phoneNumber: string, 
  sessionString: string,
  userInfo?: any
): Promise<void> => {
  try {
    console.log(`Saving session to Clerk for phone: ${phoneNumber}, userId: ${userId}`);
    
    // Get the user from Clerk
    const user = await clerkClient.users.getUser(userId);
    console.log(`Retrieved user from Clerk: ${user.id}`);
    
    // Get existing private metadata
    const privateMetadata = user.privateMetadata || {};
    
    // Get existing telegram sessions or create an empty array
    const telegramSessions = (privateMetadata as any)?.telegramSessions || [];
    console.log(`Found ${telegramSessions.length} existing sessions in Clerk metadata`);
    
    // Check if a session with this phone number already exists
    const existingSessionIndex = telegramSessions.findIndex((s: any) => s.phone === phoneNumber);
    
    // Optimize userInfo to reduce size if it exists
    let optimizedUserInfo: Record<string, any> | null = null;
    if (userInfo) {
      // Create a copy of userInfo with only essential fields
      optimizedUserInfo = {
        id: userInfo.id,
        firstName: userInfo.firstName ? encodeEmojiForStorage(userInfo.firstName) : '',
        lastName: userInfo.lastName ? encodeEmojiForStorage(userInfo.lastName) : '',
        username: userInfo.username ? encodeEmojiForStorage(userInfo.username) : '',
        phone: userInfo.phone || phoneNumber,
        premium: userInfo.premium || false,
        verified: userInfo.verified || false
      };
      
      // Handle photo separately - resize/compress if needed
      if (userInfo.photo) {
        try {
          // Store a smaller version of the photo or just a flag that photo exists
          // For now, we'll just indicate that a photo exists but not store it
          // This significantly reduces the metadata size
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
    
    // Calculate the size of the updated metadata
    const updatedSessions = [...telegramSessions];
    if (existingSessionIndex !== -1) {
      updatedSessions[existingSessionIndex] = {
        ...updatedSessions[existingSessionIndex],
        ...sessionObject
      };
    } else {
      updatedSessions.push(sessionObject);
    }
    
    const updatedMetadata = {
      ...privateMetadata,
      telegramSessions: updatedSessions
    };
    
    // Check if the size exceeds Clerk's limit (8KB)
    const metadataSize = Buffer.from(JSON.stringify(updatedMetadata)).length;
    console.log(`Metadata size: ${metadataSize} bytes (limit: 8192 bytes)`);
    
    if (metadataSize > 8000) { // Leave some buffer
      console.warn('Metadata size is approaching the limit, removing non-essential data');
      
      // Further optimize by keeping only the most recent sessions if needed
      if (updatedSessions.length > 1) {
        // Sort sessions by creation date (newest first)
        updatedSessions.sort((a, b) => 
          new Date(b.created).getTime() - new Date(a.created).getTime()
        );
        
        // Keep only the most recent session
        const optimizedSessions = [updatedSessions[0]];
        
        // Update the metadata with optimized sessions
        const finalMetadata = {
          ...privateMetadata,
          telegramSessions: optimizedSessions
        };
        
        // Check if we're still over the limit
        const finalSize = Buffer.from(JSON.stringify(finalMetadata)).length;
        console.log(`Optimized metadata size: ${finalSize} bytes`);
        
        if (finalSize > 8000) {
          // If still too large, remove userInfo completely
          optimizedSessions[0].userInfo = {
            id: optimizedUserInfo?.id,
            firstName: optimizedUserInfo?.firstName,
            username: optimizedUserInfo?.username
          };
          
          // Update the metadata with minimal userInfo
          const minimalMetadata = {
            ...privateMetadata,
            telegramSessions: optimizedSessions
          };
          
          await clerkClient.users.updateUser(userId, {
            privateMetadata: minimalMetadata
          });
          console.log(`Saved session with minimal user info due to size constraints`);
          return;
        }
        
        // Save the optimized metadata
        await clerkClient.users.updateUser(userId, {
          privateMetadata: finalMetadata
        });
        console.log(`Saved most recent session only due to size constraints`);
        return;
      }
    }
    
    // Update the user's private metadata with the original plan if size is acceptable
    await clerkClient.users.updateUser(userId, {
      privateMetadata: updatedMetadata
    });
    
    console.log(`Successfully saved session to Clerk for ${phoneNumber}`);
  } catch (error) {
    console.error('Error saving Telegram session to Clerk:', error);
    throw error;
  }
};

// Function to get available sessions from Clerk
export const getSessionsFromClerk = async (userId: string) => {
  try {
    console.log(`Getting sessions from Clerk for userId: ${userId}`);
    
    const user = await clerkClient.users.getUser(userId);
    console.log(`Retrieved user from Clerk: ${user.id}`);
    
    const privateMetadata = user.privateMetadata || {};
    
    // Get telegram sessions or return empty array if none exist
    const telegramSessions = (privateMetadata as any)?.telegramSessions || [];
    console.log(`Found ${telegramSessions.length} sessions in Clerk metadata`);
    
    // Return sessions with minimal info for the client
    return telegramSessions.map((session: any) => ({
      phone: session.phone,
      created: session.created,
      userInfo: session.userInfo || null
    }));
  } catch (error) {
    console.error('Error getting Telegram sessions from Clerk:', error);
    return [];
  }
};

// Function to get a specific session from Clerk
export const getSessionFromClerk = async (userId: string, phoneNumber: string) => {
  try {
    console.log(`Getting session from Clerk for phone: ${phoneNumber}, userId: ${userId}`);
    
    const user = await clerkClient.users.getUser(userId);
    console.log(`Retrieved user from Clerk: ${user.id}`);
    
    const privateMetadata = user.privateMetadata || {};
    console.log(`Private metadata:`, JSON.stringify(privateMetadata).substring(0, 100) + '...');
    
    // Get telegram sessions or return null if none exist
    const telegramSessions = (privateMetadata as any)?.telegramSessions || [];
    console.log(`Found ${telegramSessions.length} sessions in Clerk metadata`);
    
    // Find the session with the matching phone number
    const session = telegramSessions.find((s: any) => s.phone === phoneNumber);
    console.log(`Session found for ${phoneNumber}: ${session ? 'Yes' : 'No'}`);
    
    return session;
  } catch (error) {
    console.error('Error getting Telegram session from Clerk:', error);
    return null;
  }
};

// Function to delete a session from Clerk
export const deleteSessionFromClerk = async (userId: string, phoneNumber: string): Promise<boolean> => {
  try {
    console.log(`Deleting session from Clerk for phone: ${phoneNumber}, userId: ${userId}`);
    
    const user = await clerkClient.users.getUser(userId);
    console.log(`Retrieved user from Clerk: ${user.id}`);
    
    const privateMetadata = user.privateMetadata || {};
    
    // Get existing telegram sessions
    const telegramSessions = (privateMetadata as any)?.telegramSessions || [];
    console.log(`Found ${telegramSessions.length} sessions in Clerk metadata`);
    
    // Find the session with the matching phone number
    const sessionIndex = telegramSessions.findIndex((s: any) => s.phone === phoneNumber);
    
    if (sessionIndex === -1) {
      console.log(`No session found for ${phoneNumber}`);
      return false;
    }
    
    // Remove the session
    telegramSessions.splice(sessionIndex, 1);
    console.log(`Removed session for ${phoneNumber}`);
    
    // Update the user's private metadata
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...privateMetadata,
        telegramSessions
      }
    });
    
    console.log(`Successfully deleted session from Clerk for ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error('Error deleting Telegram session from Clerk:', error);
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
