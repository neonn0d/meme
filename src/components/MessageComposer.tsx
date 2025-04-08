import { useState, useEffect } from 'react';

interface MessageResult {
  groupId: string;
  groupName?: string;
  messageId?: number;
  messageUrl?: string;
  timestamp?: string;
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
  status: string;
  results?: {
    successful: MessageResult[];
    failed: MessageResult[];
  };
}

interface MessageComposerProps {
  selectedPhone: string | null;
  selectedGroups: string[];
  disabled: boolean;
}

export default function MessageComposer({ selectedPhone, selectedGroups, disabled }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendProgress, setSendProgress] = useState<SendProgress | null>(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState<number>(0);
  const [messageDelay, setMessageDelay] = useState(500); // Default delay 500ms
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isCheckingPremium, setIsCheckingPremium] = useState<boolean>(true);
  // Get MAX_FREE_GROUPS from environment variable or use default value of 3
  const MAX_FREE_GROUPS = parseInt(process.env.NEXT_PUBLIC_MAX_FREE_GROUPS || '3');

  // Check premium status on component mount
  useEffect(() => {
    const checkPremiumStatus = async () => {
      setIsCheckingPremium(true);
      try {
        // Get wallet address from local storage or context
        const walletAddress = localStorage.getItem('walletAddress') || '9LJn2dcUFrQ7mNQqvefpeAUsuYFeM8tsFiPUvPsNcK5W';
        
        const response = await fetch('/api/user/subscription', {
          headers: {
            'Authorization': `Bearer ${walletAddress}`
          }
        });
        const data = await response.json();
        setIsPremium(data.isSubscribed);
      } catch (error) {
        console.error('Error checking premium status:', error);
        // Default to free user if there's an error
        setIsPremium(false);
      } finally {
        setIsCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, []);

  const sendMessage = async () => {
    if (!selectedPhone || selectedGroups.length === 0 || !message.trim()) {
      setError("Please select a phone, at least one group, and enter a message");
      return;
    }

    // Check if non-premium user is trying to send to more than MAX_FREE_GROUPS
    if (!isPremium && selectedGroups.length > MAX_FREE_GROUPS) {
      setError(`Free users can only send to ${MAX_FREE_GROUPS} groups at a time. Please upgrade to premium for unlimited messaging.`);
      return;
    }

    setSendingMessage(true);
    setError(null);
    setSendProgress({
      total: selectedGroups.length,
      current: 0,
      successful: 0,
      failed: 0,
      status: 'sending',
      results: {
        successful: [],
        failed: []
      }
    });
    setCurrentGroupIndex(0);

    try {
      // Send messages one by one with progress updates
      for (let i = 0; i < selectedGroups.length; i++) {
        setCurrentGroupIndex(i);
        const groupId = selectedGroups[i];
        
        try {
          // Get wallet address from local storage or context
          const walletAddress = localStorage.getItem('walletAddress') || '9LJn2dcUFrQ7mNQqvefpeAUsuYFeM8tsFiPUvPsNcK5W';
          
          // Send message to individual group
          const response = await fetch("/api/telegram/message/single", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${walletAddress}`
            },
            body: JSON.stringify({
              phone: selectedPhone,
              groupId: groupId,
              message
            }),
          });
          
          const data = await response.json();
          
          if (data.error) {
            // Update progress with failure
            setSendProgress(prev => {
              if (!prev) return null;
              return {
                ...prev,
                current: prev.current + 1,
                failed: prev.failed + 1,
                results: {
                  successful: prev.results?.successful || [],
                  failed: [...(prev.results?.failed || []), { 
                    groupId, 
                    error: data.error,
                    timestamp: new Date().toISOString()
                  }]
                }
              };
            });
          } else {
            // Update progress with success
            setSendProgress(prev => {
              if (!prev) return null;
              return {
                ...prev,
                current: prev.current + 1,
                successful: prev.successful + 1,
                results: {
                  successful: [...(prev.results?.successful || []), { 
                    groupId,
                    groupName: data.groupName,
                    messageId: data.messageId,
                    messageUrl: data.messageUrl,
                    timestamp: data.timestamp || new Date().toISOString()
                  }],
                  failed: prev.results?.failed || []
                }
              };
            });
          }
        } catch (groupError: any) {
          // Update progress with failure
          setSendProgress(prev => {
            if (!prev) return null;
            return {
              ...prev,
              current: prev.current + 1,
              failed: prev.failed + 1,
              results: {
                successful: prev.results?.successful || [],
                failed: [...(prev.results?.failed || []), { 
                  groupId, 
                  error: groupError.message,
                  timestamp: new Date().toISOString()
                }]
              }
            };
          });
        }
        
        // Add configurable delay between messages to avoid rate limiting
        if (i < selectedGroups.length - 1) {
          await new Promise(resolve => setTimeout(resolve, messageDelay));
        }
      }
      
      // Mark as complete
      setSendProgress(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'complete'
        };
      });
    } catch (error: any) {
      console.error('Error sending messages:', error);
      setError(error.message || "Failed to send messages");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatErrorMessage = (error: string) => {
    // Handle Telegram API errors that follow the pattern: "400: PEER_ID_INVALID (caused by messages.SendMessage)"
    const telegramErrorMatch = error.match(/(\d+): ([A-Z_]+)(?:\s+\(caused by ([^)]+)\))?/);
    
    if (telegramErrorMatch) {
      const code = telegramErrorMatch[1];
      const errorType = telegramErrorMatch[2];
      
      // Map common Telegram errors to more user-friendly messages
      const errorMessages: Record<string, string> = {
        'PEER_ID_INVALID': 'Invalid chat or channel',
        'CHAT_WRITE_FORBIDDEN': 'You cannot write in this chat',
        'USER_IS_BLOCKED': 'User has blocked the bot',
        'CHANNEL_PRIVATE': 'Channel is private',
        'FLOOD_WAIT': 'Too many messages, please wait',
        'CHAT_ADMIN_REQUIRED': 'Admin permissions required'
      };
      
      const friendlyMessage = errorMessages[errorType] || errorType.replace(/_/g, ' ').toLowerCase();
      return friendlyMessage;
    }
    
    // Handle other errors
    return error.replace('Error: ', '');
  };

  return (
    <div className='flex flex-col gap-4'>
   
    <div className="bg-white p-5 rounded-xl border border-zinc-200 mb-4">
      <h3 className="text-lg font-medium text-zinc-900 mb-3">Compose Message</h3>
      
      {/* Premium status indicator - simplified */}
      {!isCheckingPremium && !isPremium && selectedGroups.length > MAX_FREE_GROUPS && (
        <div className="mb-4 p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-zinc-700">Free plan limited to {MAX_FREE_GROUPS} groups. You've selected {selectedGroups.length}.</span>
          </div>
          <a href="/pricing" className="ml-4 px-3 py-1 bg-black text-white rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors">
            Upgrade
          </a>
        </div>
      )}
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={4}
        placeholder="Enter your message here..."
        disabled={disabled || sendingMessage}
      ></textarea>

      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-4">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-1 md:space-y-0">
            <label htmlFor="delay-slider" className="text-sm font-medium text-zinc-700">
              Delay between messages: {(messageDelay / 1000).toFixed(1)} seconds
            </label>
            <span className="text-xs text-zinc-500">
              (Higher values reduce rate limiting)
            </span>
          </div>
          <input
            id="delay-slider"
            type="range"
            min="500"
            max="3000"
            step="100"
            value={messageDelay}
            onChange={(e) => setMessageDelay(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
            disabled={sendingMessage}
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={sendMessage}
          disabled={disabled || sendingMessage || selectedGroups.length === 0 || !message.trim() || (!isPremium && selectedGroups.length > MAX_FREE_GROUPS)}
          className={`font-medium py-2 px-4 rounded-lg transition-colors ${
            disabled || sendingMessage || selectedGroups.length === 0 || !message.trim() || (!isPremium && selectedGroups.length > MAX_FREE_GROUPS)
              ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
        >
          {sendingMessage ? 'Sending...' : 'Send Message'}
        </button>
      </div>

  
    </div>
    <div>
    {sendProgress && (
          <div className="bg-white p-5 rounded-xl border border-zinc-200 mb-4">
      <h3 className="text-lg font-medium text-zinc-900 mb-3">Message Progress</h3>
          {/* Progress header with gradient background */}
          <div className="bg-white border-b border-zinc-200">
            <div className="mb-2">
              <div className="flex justify-between text-sm font-medium text-zinc-700 mb-1">
                <span>Progress: {sendProgress.current} of {sendProgress.total}</span>
                <span>{Math.round((sendProgress.current / sendProgress.total) * 100)}%</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full" 
                  style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm mt-2">
              <span className="text-zinc-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {sendProgress.successful} successful
              </span>
              <span className="text-zinc-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {sendProgress.failed} failed
              </span>
            </div>
            
            {sendingMessage && currentGroupIndex < selectedGroups.length && (
              <p className="text-sm text-zinc-600 mt-2">
                Sending to group {currentGroupIndex + 1} of {selectedGroups.length}...
              </p>
            )}
            
            {sendProgress.status === 'complete' && (
              <p className="text-sm font-medium text-zinc-700 mt-2">
                Complete: {sendProgress.successful} successful, {sendProgress.failed} failed
              </p>
            )}
          </div>
          
          {/* Results section */}
          {sendProgress.status === 'complete' && sendProgress.successful > 0 && sendProgress.results?.successful && sendProgress.results.successful.length > 0 && (
            <div className="bg-white">
              <p className="text-sm font-medium text-zinc-700 my-3 md:my-0 mb-2">Successfully sent to:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {sendProgress.results.successful.map((result, index) => (
                  <div key={index} className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg text-sm transition-all duration-200 overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-zinc-800 truncate">{result.groupName || result.groupId}</div>
                          <div className="text-xs text-zinc-500">
                            {result.timestamp && new Date(result.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </div>
                        <div className="ml-auto">
                          {/* Removed "Seen" indicator */}
                        </div>
                      </div>
                    </div>
                    
                    {result.messageUrl ? (
                      <a 
                        href={result.messageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-zinc-800 hover:bg-black text-white text-center py-2 text-sm transition-colors duration-200"
                      >
                        View Message
                      </a>
                    ) : (
                      <div className="block w-full bg-zinc-200 text-zinc-600 text-center py-2 text-sm">
                        Private Group
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {sendProgress.status === 'complete' && sendProgress.failed > 0 && sendProgress.results?.failed && sendProgress.results.failed.length > 0 && (
            <div className="p-3 bg-white border-t border-zinc-100">
              <p className="text-sm font-medium text-zinc-700 mb-3">Failed messages:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {sendProgress.results.failed.map((result, index) => (
                  <div key={index} className="bg-white border border-red-100 hover:border-red-200 rounded-lg text-sm transition-all duration-200 overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-zinc-800 truncate">{result.groupName || result.groupId}</div>
                          <div className="text-xs text-zinc-500">
                            {result.timestamp && new Date(result.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <div className="text-xs text-red-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Failed
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="block w-full bg-red-50 text-red-600 text-center py-2 text-sm">
                      {result.error ? formatErrorMessage(result.error) : 'Unknown error'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
