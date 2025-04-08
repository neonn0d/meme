"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { decodeEmojiFromStorage } from "@/lib/telegram";
import MessageComposer from '@/components/MessageComposer';
import { useSubscription } from "@/hooks/useSubscription";
import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";


interface MessageResult {
  groupId: string;
  messageId?: string;
  error?: string;
}

interface MessageResults {
  successful: MessageResult[];
  failed: MessageResult[];
}

interface SendProgress {
  total: number;
  current: number;
  successful: number;
  failed: number;
  status: 'sending' | 'complete';
  results: {
    successful: MessageResult[];
    failed: MessageResult[];
  }
}

export default function TelegramDashboard() {
  const router = useRouter();
  const { isSignedIn, userProfile } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [debugLoading, setDebugLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [globalFastMode, setGlobalFastMode] = useState(true);
  const [fastModeMap, setFastModeMap] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);
  const [sendProgress, setSendProgress] = useState<SendProgress>({
    total: 0,
    current: 0,
    successful: 0,
    failed: 0,
    status: 'sending',
    results: {
      successful: [],
      failed: []
    }
  });
  const PREMIUM_AMOUNT = Number(
    process.env.NEXT_PUBLIC_PREMIUM_AMOUNT || "0.25"
  ); // SOL
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const {
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    subscriptionData,
    checkSubscription,
  } = useSubscription();
  
  // Extract subscription data for easier access
  const isSubscribed = subscriptionData?.isSubscribed || false;
  const subscriptionDetails = subscriptionData?.details || null;

  // Effect to fetch sessions when auth state changes
  useEffect(() => {
    console.log('TelegramDashboard mounted, auth state:', { isSignedIn, userProfile });
    
    // Only fetch sessions if user is signed in and we have their profile
    if (isSignedIn && userProfile) {
      fetchSessions();
      fetchDebugInfo();
    } else {
      console.log('Not fetching sessions - user not signed in or profile not loaded');
      setLoading(false);
    }
  }, [isSignedIn, userProfile]);

  const fetchSessions = async () => {
    console.log('fetchSessions called, auth state:', { isSignedIn, userProfile });
    setLoading(true);
    setError(null);
    try {
      // Check if user is signed in with wallet
      if (!isSignedIn || !userProfile?.wallet_address) {
        console.error('User not signed in or wallet address missing:', { isSignedIn, userProfile });
        setError('Please connect your Solana wallet to continue.');
        setLoading(false);
        return;
      }

      console.log('Fetching sessions with wallet address:', userProfile.wallet_address);
      
      // Try to fetch directly from Supabase first if client is available
      if (supabase) {
        try {
          // Get the user ID from the wallet address
          console.log('Querying Supabase for wallet address:', userProfile.wallet_address);
          
          // Use a different approach to query by wallet address
          const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id')
            .filter('wallet_address', 'eq', userProfile.wallet_address);
            
          if (usersError) {
            console.error('Error querying users by wallet address:', usersError);
            throw new Error(`Failed to query users: ${usersError.message}`);
          }
          
          // Find the matching user
          const userData = users && users.length > 0 ? users[0] : null;
          
          if (userData && userData.id) {
            console.log('Found user ID:', userData.id);
            
            // Get the user's private metadata
            const { data: privateMetadata, error: metadataError } = await supabase
              .from('user_private_metadata')
              .select('telegram_sessions')
              .eq('user_id', userData.id)
              .single();
              
            if (metadataError) {
              console.error('Error fetching user metadata:', metadataError);
              throw new Error(`Failed to fetch metadata: ${metadataError.message}`);
            }
          
            if (privateMetadata && privateMetadata.telegram_sessions) {
              console.log('Found sessions in private metadata:', privateMetadata.telegram_sessions);
              setSessions(privateMetadata.telegram_sessions.map((session: any) => ({
                phone: session.phone,
                created: session.created,
                userInfo: session.userInfo || null
              })));
              setLoading(false);
              return;
            }
          } else {
            console.log('No user found with wallet address:', userProfile.wallet_address);
          }
        } catch (supabaseError: any) {
          console.error('Error fetching from Supabase directly:', supabaseError);
          // Continue to API fallback
        }
      } else {
        console.log('Supabase client not available, skipping direct DB query');
      }
      
      // Fallback to API
      console.log('Falling back to API for sessions');
      try {
        if (!userProfile || !userProfile.wallet_address) {
          console.error('No wallet address available in user profile', userProfile);
          setError('No wallet address available. Please ensure your wallet is connected.');
          setLoading(false);
          return;
        }
        
        console.log('Making API request with wallet address:', userProfile.wallet_address);
        
        // Make the API request
        const response = await fetch("/api/telegram/sessions", {
          headers: {
            'Authorization': `Bearer ${userProfile.wallet_address}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error(`API error: ${response.status} ${response.statusText}`, errorData);
          
          if (response.status === 404 && errorData.walletAddress) {
            setError(`User not found for wallet address: ${errorData.walletAddress}. Please ensure your wallet is registered.`);
          } else {
            setError(`API error: ${response.status} ${response.statusText}. ${errorData.error || ''}`);
          }
          
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.success) {
          setSessions(data.sessions || []);
          
          // Initialize fast mode to true for all sessions by default
          if (data.sessions && data.sessions.length > 0) {
            const initialFastModeMap: Record<string, boolean> = {};
            data.sessions.forEach((session: any) => {
              initialFastModeMap[session.phone] = true;
            });
            setFastModeMap(initialFastModeMap);
          }
        } else {
          setError(data.error || "Failed to fetch sessions");
        }
      } catch (error: any) {
        console.error('API request failed:', error);
        setError(`Failed to fetch sessions: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }

      // Note: This code is now handled in the try block above
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (phone: string) => {
    if (!confirm(`Are you sure you want to delete the session for ${phone}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingSession(phone);
      // Check if user is signed in with wallet
      if (!isSignedIn || !userProfile?.wallet_address) {
        setError('Please connect your Solana wallet to continue.');
        setDeletingSession(null);
        return;
      }

      const response = await fetch("/api/telegram/delete-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userProfile.wallet_address}`
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the session from the list
        setSessions(sessions.filter((session) => session.phone !== phone));
        // If this was the selected phone, clear the selection and groups
        if (selectedPhone === phone) {
          setSelectedPhone(null);
          setGroups([]);
          setSelectedGroups([]);
        }
      } else {
        setError(data.error || "Failed to delete session");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setDeletingSession(null);
    }
  };

  const fetchGroups = async (phone: string) => {
    setLoadingGroups(true);
    setError(null);
    setGroups([]); // Clear previous groups
    setSelectedGroups([]); // Clear selected groups
    setSelectedPhone(phone); // Set selected phone immediately for better UX

    try {
      // Check if user is signed in with wallet
      if (!isSignedIn || !userProfile?.wallet_address) {
        setError('Please connect your Solana wallet to continue.');
        setLoadingGroups(false);
        return;
      }

      const response = await fetch("/api/telegram/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userProfile.wallet_address}`
        },
        body: JSON.stringify({ phone, fastMode: globalFastMode }),
      });

      const data = await response.json();

      if (data.success) {
        setGroups(data.groups || []);
      } else {
        setError(data.error || "Failed to fetch groups");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoadingGroups(false);
    }
  };

  const toggleGroupSelection = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const clearSelectedGroups = () => {
    setSelectedGroups([]);
  };

  const toggleGlobalFastMode = () => {
    setGlobalFastMode(!globalFastMode);
  };
  
  const handleSendMessage = async () => {
    if (!selectedPhone || selectedGroups.length === 0 || !message.trim()) {
      setError('Please select a phone, at least one group, and enter a message');
      return;
    }
    
    if (!isSignedIn || !userProfile?.wallet_address) {
      setError('Please connect your Solana wallet to continue.');
      return;
    }
    
    try {
      setSendingMessage(true);
      setSendResult(null);
      setError(null);
      
      const response = await fetch("/api/telegram/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userProfile.wallet_address}`
        },
        body: JSON.stringify({
          phone: selectedPhone,
          groupIds: selectedGroups,
          message: message.trim()
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSendResult(data.results);
        setMessage(''); // Clear the message input
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the message');
    } finally {
      setSendingMessage(false);
    }
  };

  const fetchDebugInfo = async () => {
    if (!userProfile || !userProfile.wallet_address) {
      console.error('No wallet address available for debug');
      return;
    }
    
    setDebugLoading(true);
    try {
      const response = await fetch('/api/debug/wallet', {
        headers: {
          'Authorization': `Bearer ${userProfile.wallet_address}`
        }
      });
      
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Error fetching debug info:', error);
    } finally {
      setDebugLoading(false);
    }
  };

  // If still loading, show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
        <p className="text-zinc-600">Loading your Telegram sessions...</p>
      </div>
    );
  }

  // If not signed in, show a message to connect wallet
  if (!isSignedIn || !userProfile) {
    return (
      <div className="min-h-screen bg-white py-12 pt-20 flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* BUIDL connecting to Telegram */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-8">
              {/* BUIDL Logo */}
              <div className="rounded-full bg-black flex items-center justify-center flex p-2" style={{ width: '60px', height: '60px' }}>
                <span className="text-white font-bold text-base tracking-wider">BUIDL</span>
              </div>
              
              {/* Connecting Line */}
              <div className="h-0.5 w-8 bg-zinc-300"></div>
              
              {/* Telegram Logo */}
              <div className="rounded-full bg-black flex items-center justify-center p-2" style={{ width: '60px', height: '60px' }}>
                <img 
                  src="https://i.imgur.com/5tetQoN.png" 
                  alt="Telegram Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-semibold text-zinc-900 mb-4">Connect Your Wallet</h1>
          <p className="text-zinc-600 mb-8">Please connect your Solana wallet to access the Telegram dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-4 sm:space-y-8">

        {/* Header Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-zinc-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                Telegram Dashboard
              </h1>
              <p className="mt-2 text-zinc-600">
                Manage your Telegram sessions and send messages to groups.
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
              {isSubscriptionLoading ? (
                <div className="animate-pulse w-32 h-8 bg-zinc-100 rounded-full"></div>
              ) : (
                <>
                  {isSubscribed && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 mb-1">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Premium Active
                    </span>
                  )}
                  {!isSubscribed && (
                    <Link
                      href="/pricing"
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Upgrade to Premium
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}



        {/* Sessions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <div className="flex md:flex-row flex-col gap-4 justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Your Telegram Sessions</h2>
            <Link 
              href="/telegram/login" 
              className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              <span className="mr-2 font-medium text-sm">Add Telegram account</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="animate-pulse h-44 bg-zinc-100 rounded-lg" />
              <div className="animate-pulse h-44 bg-zinc-100 rounded-lg hidden sm:block" />
              <div className="animate-pulse h-44 bg-zinc-100 rounded-lg hidden lg:block" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 text-center">
              <p className="mb-4 text-zinc-600">You don't have any Telegram sessions yet.</p>
              <Link
                href="/telegram/login"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
              >
                <span className="mr-2 font-medium text-sm">Add Telegram account</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <div 
                  key={session.phone} 
                  className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedPhone === session.phone 
                      ? 'border-black shadow-sm' 
                      : 'border-zinc-100 hover:border-zinc-200'
                  }`}
                >
                  <div className={`p-4 ${selectedPhone === session.phone ? 'bg-white' : 'bg-white'}`}>
                    <div className="flex items-center mb-3">
                      {session.userInfo && (session.userInfo.photo || session.userInfo.photoBuffer || session.userInfo.hasPhoto) ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center bg-blue-50">
                          <svg
                            className="h-6 w-6"
                            fill="#0088cc"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.12.13.145.309.164.472-.001.089.016.181.003.288z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-3">
                          <span className="text-base font-medium">{session.phone.substring(1, 3)}</span>
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center">
                          {session.userInfo && session.userInfo.username ? (
                            <p className="font-medium text-zinc-900">@{session.userInfo.username}</p>
                          ) : (
                            <p className="font-medium text-zinc-900 emoji-container">
                              {decodeEmojiFromStorage(session.userInfo?.firstName || '')} {decodeEmojiFromStorage(session.userInfo?.lastName || '')}
                            </p>
                          )}
                          
                          {session.userInfo && session.userInfo.premium && (
                            <span className="ml-2 inline-flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">{session.phone.replace(/^\+?(\d{1})(.*)(\d{1})$/, '+$1•••••$3')}</p>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteSession(session.phone)}
                        className={`p-1.5 rounded-full transition-colors ${
                          loadingGroups || deletingSession === session.phone
                            ? 'text-zinc-300 cursor-not-allowed'
                            : 'text-zinc-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        disabled={loadingGroups || deletingSession === session.phone}
                        title="Delete session"
                      >
                        {deletingSession === session.phone ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 mb-3">
                      Account connected: <span className="text-zinc-500  bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{new Date(session.created).toLocaleString('en-US', { hour12: true })}</span>
                    </p>

                    <button
                      onClick={() => fetchGroups(session.phone)}
                      className={`w-full text-center text-sm py-2 px-4 rounded-md transition-colors ${
                        loadingGroups 
                          ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                          : selectedPhone === session.phone
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                      disabled={loadingGroups}
                    >
                      {loadingGroups && selectedPhone === session.phone ? "Loading..." : "View Groups"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer ${
                globalFastMode
                  ? 'bg-black border-black text-white'
                  : 'border-black bg-white'
              }`}
              onClick={toggleGlobalFastMode}
            >
              {globalFastMode && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <label 
              onClick={toggleGlobalFastMode}
              className="text-sm text-zinc-700 cursor-pointer"
            >
              Global Fast Mode (skip photos & details)
            </label>
          </div>
        </div>

        {selectedPhone && (
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4">
              Groups for {
                sessions.find(s => s.phone === selectedPhone)?.userInfo?.username
                  ? `@${(sessions.find(s => s.phone === selectedPhone)?.userInfo?.username)}`
                  : selectedPhone.replace(/^\+?(\d{1})(.*)(\d{1})$/, '+$1•••••$3')
              }
            </h2>
            
            {loadingGroups ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-zinc-100 rounded-lg w-1/3"></div>
                <div className="h-20 bg-zinc-100 rounded-lg"></div>
                <div className="h-20 bg-zinc-100 rounded-lg"></div>
              </div>
            ) : groups.length === 0 ? (
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                <p className="text-zinc-600">No groups found for this account.</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-zinc-900">Select Groups</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedGroups(groups.map(group => group.id))}
                        className="text-sm text-zinc-500 hover:text-zinc-700"
                        disabled={groups.length === 0}
                      >
                        Select All
                      </button>
                      {selectedGroups.length > 0 && (
                        <button 
                          onClick={clearSelectedGroups}
                          className="text-sm text-zinc-500 hover:text-zinc-700"
                        >
                          Clear ({selectedGroups.length})
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-96 overflow-y-auto border border-zinc-200 rounded-lg p-4">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className={`p-4 transition-all duration-200 cursor-pointer ${
                          selectedGroups.includes(group.id)
                            ? 'border rounded-lg overflow-hidden transition-all duration-200 border-black shadow-sm'
                            : 'bg-white border border-zinc-100 hover:border-zinc-200 rounded-lg'
                        }`}
                        onClick={() => toggleGroupSelection(group.id)}
                      >
                        <div className="flex items-center">
                          {/* Left side: Photo */}
                          {(group.photoBuffer || (group.photo && group.photo.strippedThumb)) && (
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                                <img
                                  src={`data:image/jpeg;base64,${group.photoBuffer || group.photo.strippedThumb}`}
                                  alt={group.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}

                          {/* Middle: Group info */}
                          <div className="flex-grow">
                            <h3 className="font-medium text-zinc-900">{group.title}</h3>
                            <div className="flex flex-col mt-1">
                              <p className="text-sm text-zinc-500">
                                {group.isChannel ? "Channel" : "Group"}
                                {group.participantsCount !== null && (
                                  <> • {group.participantsCount.toLocaleString()} {group.isChannel ? "subscribers" : "members"}</>
                                )}
                              </p>
                              {group.username && (
                                <p className="text-sm text-zinc-500">
                                  @{group.username}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Checkbox */}
                          <div className="flex-shrink-0 ml-2">
                            <div
                              className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer ${
                                selectedGroups.includes(group.id)
                                  ? 'bg-black border-black text-white'
                                  : 'border-zinc-300 bg-white'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleGroupSelection(group.id);
                              }}
                            >
                              {selectedGroups.includes(group.id) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <MessageComposer 
                  selectedPhone={selectedPhone}
                  selectedGroups={selectedGroups}
                  disabled={loadingGroups}
                />
              </div>
            )}
          </div>
        )}

        {sendResult && sendResult.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-4">Message Results</h2>
            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
              <p className="font-medium mb-2 text-zinc-800">
                Successfully sent to {sendResult.filter((r: any) => r.success).length} groups,
                failed for {sendResult.filter((r: any) => !r.success).length} groups
              </p>
              {sendResult.some((r: any) => !r.success) && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-600 mb-1">Failed groups:</p>
                  <ul className="text-sm text-zinc-600 list-disc pl-5">
                    {sendResult.filter((r: any) => !r.success).map((result: any, index: number) => (
                      <li key={index}>
                        {result.groupId}: {result.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
