import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { StringSession } from 'telegram/sessions';
import { encryptSessionInfo, saveSessionToSupabase, decryptSessionInfo } from '@/lib/telegram';
import { CustomTelegramClient } from '@/lib/customTelegramClient';
import { Api } from 'telegram';

// Load environment variables
const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";

export async function POST(req: Request) {
  console.log('Telegram code verification API called');
  
  // For this API, we'll skip authentication since the Telegram API itself
  // will provide security through the verification code process
  // The actual account linking will happen after verification
  
  // We'll use a null userId for now, and get the real userId from the request body if provided
  let userId: string | null = null;

  // Validate API credentials
  if (!apiId || !apiHash) {
    return NextResponse.json({ error: 'Telegram API credentials not configured' }, { status: 500 });
  }

  try {
    // Get the request body
    const { code, password, sessionInfo, userId: requestUserId } = await req.json();
    
    // If userId is provided in the request, use it
    if (requestUserId) {
      userId = requestUserId;
    }
    
    // Validate required fields
    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }
    
    if (!sessionInfo) {
      return NextResponse.json({ error: 'Session information is required' }, { status: 400 });
    }
    
    // Decrypt the session info
    const { phoneNumber, phoneCodeHash, stringSession } = decryptSessionInfo(sessionInfo);
    
    if (!phoneNumber || !phoneCodeHash) {
      return NextResponse.json({ error: 'Invalid session information' }, { status: 400 });
    }
    
    // Create a new Telegram client with the provided session
    const session = new StringSession(stringSession);
    const client = new CustomTelegramClient(session, apiId, apiHash, {
      connectionRetries: 5,
    });

    // Connect to Telegram
    await client.connect();
    
    try {
      // Check if we're already logged in
      const isLoggedIn = await client.checkAuthorization();
      
      if (isLoggedIn) {
        // We're already logged in, no need to verify code or password
        console.log('Already logged in, no need to verify code or password');
        
        // Get the session as a string
        const sessionString = session.save() as string;
        
        // Save to Supabase
        if (userId) {
          // Get user info for storing with the session
          const me = await client.getMe();
          const userInfo: any = {
            id: me.id.toString(),
            firstName: me.firstName,
            lastName: me.lastName,
            username: me.username,
            premium: me.premium,
            verified: me.verified
          };
          
          // Try to get profile photo - simplified approach
          try {
            const buffer = await client.downloadProfilePhoto(me.id, { isBig: false });
            if (buffer) {
              userInfo.photo = buffer.toString('base64');
            }
          } catch (photoError) {
            console.error('Error getting profile photo:', photoError);
          }
          
          // Only save to Supabase if we have a userId
          if (userId) {
            await saveSessionToSupabase(userId, phoneNumber, sessionString, userInfo);
          } else {
            console.log('No userId provided, skipping saving session to Supabase');
          }
        }
        
        await client.disconnect();
        
        return NextResponse.json({ 
          success: true, 
          message: 'Already logged in',
          requires2FA: false
        });
      }

      // If this is a password verification request
      if (password && (!code || code === '')) {
        console.log('Processing password verification...');
        
        try {
          // Get the current password info
          const passwordInfo = await client.invoke(new Api.account.GetPassword());
          
          // Import the Password helper to compute the SRP check
          const { computeCheck } = await import('telegram/Password');
          
          // Compute the password check parameters
          const check = await computeCheck(passwordInfo, password);
          
          // Send the password check
          await client.invoke(new Api.auth.CheckPassword({
            password: check
          }));
          
          console.log('Password verification successful');
          
          // Get user profile information
          let userInfo = null;
          try {
            console.log('Fetching user profile information after 2FA...');
            const me = await client.getMe();
            console.log('User info retrieved after 2FA:', JSON.stringify(me, null, 2));
            
            // Get profile photo if available
            let photoBuffer: Buffer | null = null;
            try {
              const downloadedPhoto = await client.downloadProfilePhoto(me, {
                isBig: true
              });
              
              if (downloadedPhoto && Buffer.isBuffer(downloadedPhoto)) {
                photoBuffer = downloadedPhoto;
                console.log('Profile photo downloaded, size:', photoBuffer.length);
              } else {
                console.log('Downloaded photo is not a buffer or is null:', typeof downloadedPhoto);
              }
            } catch (photoError: any) {
              console.log('Could not download profile photo:', photoError.message);
            }
            
            userInfo = {
              id: me.id?.toString(),
              firstName: me.firstName || '',
              lastName: me.lastName || '',
              username: me.username || '',
              phone: me.phone || phoneNumber,
              photo: photoBuffer ? photoBuffer.toString('base64') : null,
              premium: me.premium || false,
              verified: me.verified || false,
              scam: me.scam || false,
              fake: me.fake || false,
              bot: me.bot || false
            };
            
            console.log('Prepared userInfo object after 2FA:', JSON.stringify({
              ...userInfo,
              photo: userInfo.photo ? `[Base64 string of length ${userInfo.photo.length}]` : null
            }, null, 2));
          } catch (userInfoError: any) {
            console.error('Error fetching user profile after 2FA:', userInfoError.message);
            // Continue even if we can't get user info
          }
          
          // Save the session
          const sessionString = session.save() as string;
          
          try {
            // Save the session to Clerk's private metadata
            console.log('Saving session to Clerk for phone (after 2FA):', phoneNumber);
            console.log('userInfo available after 2FA:', userInfo ? 'Yes' : 'No');
            if (userInfo) {
              console.log('userInfo keys after 2FA:', Object.keys(userInfo));
            }
            // Only save to Supabase if we have a userId
          if (userId) {
            await saveSessionToSupabase(userId, phoneNumber, sessionString, userInfo);
          } else {
            console.log('No userId provided, skipping saving session to Supabase');
          }
            console.log('Successfully saved session to Supabase after 2FA');
          } catch (supabaseError: any) {
            console.error('Error saving to Supabase after 2FA:', supabaseError);
            // Continue even if Clerk save fails
          }
          
          // Disconnect the client
          await client.disconnect();
          
          return NextResponse.json({ 
            success: true, 
            message: 'Successfully logged in with 2FA',
            requires2FA: false
          });
        } catch (passwordError: any) {
          console.error('Password verification error:', passwordError);
          
          // Disconnect the client
          await client.disconnect();
          
          // Return error for invalid password
          return NextResponse.json({ 
            error: 'Invalid 2FA password: ' + (passwordError.message || 'Unknown error')
          }, { status: 400 });
        }
      }
      
      // This is a code verification request
      if (!code) {
        return NextResponse.json({ error: 'Code is required for verification' }, { status: 400 });
      }
      
      try {
        console.log('Verifying code...');
        
        // Sign in with the code
        await client.invoke(
          new Api.auth.SignIn({
            phoneNumber,
            phoneCodeHash,
            phoneCode: code
          })
        );

        console.log('Successfully signed in with code');
        
        // Check if we're actually logged in
        const isLoggedIn = await client.checkAuthorization();
        console.log('Login status after code verification:', isLoggedIn ? 'Logged in' : 'Not logged in');
        
        if (!isLoggedIn) {
          await client.disconnect();
          return NextResponse.json({ error: 'Failed to sign in' }, { status: 400 });
        }
        
        // Get user info if available
        let userInfo = null;
        try {
          console.log('Fetching user profile...');
          const me = await client.getMe();
          console.log('User profile retrieved:', me.id?.toString());
          
          // Try to get profile photo
          let photoBuffer = null;
          try {
            console.log('Downloading profile photo...');
            const downloadedPhoto = await client.downloadProfilePhoto(me.id);
            
            if (Buffer.isBuffer(downloadedPhoto)) {
              photoBuffer = downloadedPhoto;
              console.log('Profile photo downloaded, size:', photoBuffer.length);
            } else {
              console.log('Downloaded photo is not a buffer or is null:', typeof downloadedPhoto);
            }
          } catch (photoError: any) {
            console.log('Could not download profile photo:', photoError.message);
          }
          
          userInfo = {
            id: me.id?.toString(),
            firstName: me.firstName || '',
            lastName: me.lastName || '',
            username: me.username || '',
            phone: me.phone || phoneNumber,
            photo: photoBuffer ? photoBuffer.toString('base64') : null,
            premium: me.premium || false,
            verified: me.verified || false,
            scam: me.scam || false,
            fake: me.fake || false,
            bot: me.bot || false
          };
          
          console.log('Prepared userInfo object:', JSON.stringify({
            ...userInfo,
            photo: userInfo.photo ? `[Base64 string of length ${userInfo.photo.length}]` : null
          }, null, 2));
        } catch (userInfoError: any) {
          console.error('Error fetching user profile:', userInfoError.message);
          // Continue even if we can't get user info
        }
        
        // Get the session as a string
        const sessionString = session.save() as string;
        
        console.log('Session string obtained, length:', sessionString.length);
        
        // Always save to Clerk if userId is available
        if (userId) {
          try {
            // Save the session to Clerk's private metadata
            console.log('Saving session to Clerk for phone:', phoneNumber);
            console.log('userInfo available:', userInfo ? 'Yes' : 'No');
            if (userInfo) {
              console.log('userInfo keys:', Object.keys(userInfo));
            }
            // Only save to Supabase if we have a userId
          if (userId) {
            await saveSessionToSupabase(userId, phoneNumber, sessionString, userInfo);
          } else {
            console.log('No userId provided, skipping saving session to Supabase');
          }
            console.log('Successfully saved session to Supabase');
          } catch (supabaseError: any) {
            console.error('Error saving to Supabase:', supabaseError);
            // Continue even if Supabase save fails - but log it clearly
            console.error('IMPORTANT: Session was not saved to Supabase due to an error');
          }
        } else {
          console.error('IMPORTANT: No userId available, cannot save session to Supabase');
        }
        
        return NextResponse.json({ 
          success: true,
          message: 'Successfully signed in to Telegram',
          session: encryptSessionInfo({ phone: phoneNumber }),
          userInfo: userInfo,
          debug: {
            userInfoAvailable: userInfo ? true : false,
            userInfoKeys: userInfo ? Object.keys(userInfo) : [],
            photoAvailable: userInfo?.photo ? true : false,
            photoLength: userInfo?.photo ? userInfo.photo.length : 0
          }
        });
      } catch (signInError: any) {
        console.error('Sign in error:', signInError);
        
        // Check if this is a FLOOD_WAIT error
        const floodWaitMatch = signInError.message?.match(/A wait of (\d+) seconds is required/i);
        if (floodWaitMatch) {
          const waitSeconds = parseInt(floodWaitMatch[1]);
          const waitMinutes = Math.ceil(waitSeconds / 60);
          
          // Disconnect the client
          await client.disconnect();
          
          return NextResponse.json({ 
            error: `Too many login attempts. Telegram requires you to wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before trying again.`
          }, { status: 429 });
        }
        
        // Check if the error is due to 2FA being required
        if (
          signInError.message && (
            signInError.message.includes('2FA') || 
            signInError.message.includes('SESSION_PASSWORD_NEEDED') ||
            signInError.message.includes('PASSWORD_REQUIRED')
          )
        ) {
          console.log("2FA password is required for login");
          
          // If password was provided, try to verify it immediately
          if (password) {
            console.log('Password provided, attempting 2FA verification...');
            
            try {
              // Get the current password info
              const passwordInfo = await client.invoke(new Api.account.GetPassword());
              
              // Import the Password helper to compute the SRP check
              const { computeCheck } = await import('telegram/Password');
              
              // Compute the password check parameters
              const check = await computeCheck(passwordInfo, password);
              
              // Send the password check
              await client.invoke(new Api.auth.CheckPassword({
                password: check
              }));
              
              console.log('Password verification successful');
              
              // Get user profile information
              let userInfo = null;
              try {
                console.log('Fetching user profile information after 2FA...');
                const me = await client.getMe();
                console.log('User info retrieved after 2FA:', JSON.stringify(me, null, 2));
                
                // Get profile photo if available
                let photoBuffer: Buffer | null = null;
                try {
                  const downloadedPhoto = await client.downloadProfilePhoto(me, {
                    isBig: true
                  });
                  
                  if (downloadedPhoto && Buffer.isBuffer(downloadedPhoto)) {
                    photoBuffer = downloadedPhoto;
                    console.log('Profile photo downloaded, size:', photoBuffer.length);
                  } else {
                    console.log('Downloaded photo is not a buffer or is null:', typeof downloadedPhoto);
                  }
                } catch (photoError: any) {
                  console.log('Could not download profile photo:', photoError.message);
                }
                
                userInfo = {
                  id: me.id?.toString(),
                  firstName: me.firstName || '',
                  lastName: me.lastName || '',
                  username: me.username || '',
                  phone: me.phone || phoneNumber,
                  photo: photoBuffer ? photoBuffer.toString('base64') : null,
                  premium: me.premium || false,
                  verified: me.verified || false,
                  scam: me.scam || false,
                  fake: me.fake || false,
                  bot: me.bot || false
                };
                
                console.log('Prepared userInfo object after 2FA:', JSON.stringify({
                  ...userInfo,
                  photo: userInfo.photo ? `[Base64 string of length ${userInfo.photo.length}]` : null
                }, null, 2));
              } catch (userInfoError: any) {
                console.error('Error fetching user profile after 2FA:', userInfoError.message);
                // Continue even if we can't get user info
              }
              
              // Save the session
              const sessionString = session.save() as string;
              
              try {
                // Save the session to Clerk's private metadata
                console.log('Saving session to Clerk for phone (after 2FA):', phoneNumber);
                console.log('userInfo available after 2FA:', userInfo ? 'Yes' : 'No');
                if (userInfo) {
                  console.log('userInfo keys after 2FA:', Object.keys(userInfo));
                }
                // Only save to Supabase if we have a userId
          if (userId) {
            await saveSessionToSupabase(userId, phoneNumber, sessionString, userInfo);
          } else {
            console.log('No userId provided, skipping saving session to Supabase');
          }
                console.log('Successfully saved session to Supabase after 2FA');
              } catch (supabaseError: any) {
                console.error('Error saving to Supabase after 2FA:', supabaseError);
                // Continue even if Supabase save fails
              }
              
              // Disconnect the client
              await client.disconnect();
              
              return NextResponse.json({ 
                success: true, 
                message: 'Successfully logged in with 2FA',
                requires2FA: false
              });
            } catch (passwordError: any) {
              console.error('Password verification error:', passwordError);
              
              // Disconnect the client
              await client.disconnect();
              
              // Return error for invalid password
              return NextResponse.json({ 
                error: 'Invalid 2FA password: ' + (passwordError.message || 'Unknown error')
              }, { status: 400 });
            }
          }
          
          // If no password was provided or password verification failed,
          // return that 2FA is required
          const updatedSessionInfo = {
            ...sessionInfo,
            // Save the current session state for the password verification step
            stringSession: session.save() as string
          };
          
          // Encrypt the updated session info
          const encryptedUpdatedSessionInfo = encryptSessionInfo(updatedSessionInfo);
          
          // Disconnect the client
          await client.disconnect();
          
          return NextResponse.json({ 
            success: true, 
            message: '2FA required',
            requires2FA: true,
            sessionInfo: encryptedUpdatedSessionInfo
          });
        }
        
        // For other errors, disconnect and throw
        await client.disconnect();
        throw signInError;
      }
    } catch (error: any) {
      // Disconnect the client
      if (client.connected) {
        await client.disconnect();
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Telegram verification error:', error);
    
    // Check for FLOOD_WAIT error in the outer catch block as well
    const floodWaitMatch = error.message?.match(/A wait of (\d+) seconds is required/i);
    if (floodWaitMatch) {
      const waitSeconds = parseInt(floodWaitMatch[1]);
      const waitMinutes = Math.ceil(waitSeconds / 60);
      
      return NextResponse.json({ 
        error: `Too many login attempts. Telegram requires you to wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before trying again.`
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to verify' 
    }, { status: 500 });
  }
}
