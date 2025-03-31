"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { getSessionsFromClerk, decodeEmojiFromStorage } from "@/lib/telegram";

// Helper function to convert emoji string to HTML entities
const convertEmojiToHtmlEntities = (text: string) => {
  return Array.from(text)
    .map(char => {
      const codePoint = char.codePointAt(0);
      if (codePoint && codePoint > 127) {
        return `&#${codePoint};`;
      }
      return char;
    })
    .join('');
};

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
  const { userId } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [randomize, setRandomize] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageResults, setMessageResults] = useState<MessageResults | null>(null);
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
  const [deletingSession, setDeletingSession] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/telegram/sessions");
      const data = await response.json();

      if (data.success) {
        setSessions(data.sessions || []);
      } else {
        setError(data.error || "Failed to fetch sessions");
      }
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
      const response = await fetch("/api/telegram/delete-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      const response = await fetch("/api/telegram/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
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

  const sendMessage = async () => {
    if (!selectedPhone || selectedGroups.length === 0 || !message.trim()) {
      setError("Please select a phone, at least one group, and enter a message");
      return;
    }

    setSendingMessage(true);
    setError(null);
    setMessageResults(null);

    try {
      const response = await fetch("/api/telegram/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: selectedPhone,
          groupIds: selectedGroups,
          message,
          randomize
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSendProgress({
          total: data.progress.total,
          current: data.progress.current,
          successful: data.progress.successful,
          failed: data.progress.failed,
          status: data.status,
          results: {
            successful: [],
            failed: []
          }
        });
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    // Add CSS for emoji support
    const style = document.createElement('style');
    style.textContent = `
      p, span, div {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol", "Apple Color Emoji", "Noto Color Emoji", Roboto, Helvetica, Arial, sans-serif;
      }
      .emoji {
        font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
        font-size: 1.2em;
        display: inline-block;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-full pt-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-0 py-6 sm:py-12 space-y-4 sm:space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-zinc-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
            Telegram Dashboard
          </h1>
          <p className="mt-2 text-zinc-600">
            Manage your Telegram sessions and send messages to groups.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Sessions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Your Telegram Sessions</h2>
            <Link 
              href="/telegram/login" 
              className="flex items-center bg-zinc-50 hover:bg-zinc-100 text-zinc-800 px-4 py-2 rounded-lg transition-all duration-200 border border-zinc-200 shadow-sm hover:shadow"
            >
              <span className="mr-2 font-medium text-sm">Add Telegram account</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse h-20 bg-zinc-100 rounded-lg" />
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
                  className={`border rounded-xl p-5 transition-all duration-200 ${
                    selectedPhone === session.phone 
                      ? 'border-blue-300 bg-blue-50 shadow-sm' 
                      : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    {session.userInfo && (session.userInfo.photo || session.userInfo.photoBuffer || session.userInfo.hasPhoto) ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border border-zinc-200 flex items-center justify-center bg-blue-50">
                        <svg
                          className="h-8 w-8"
                          fill="#0088cc"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.12.13.145.309.164.472-.001.089.016.181.003.288z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-3 border border-zinc-200">
                        <span className="text-lg font-semibold">{session.phone.substring(1, 3)}</span>
                      </div>
                    )}

                    <div>
                      {session.userInfo && session.userInfo.username ? (
                        <>
                          <p className="font-semibold text-zinc-900">@{session.userInfo.username}</p>
                          <p className="text-sm text-zinc-500">{session.phone.replace(/^\+?(\d{1})(.*)(\d{1})$/, '+$1•••••$3')}</p>
                        </>
                      ) : (
                        <p className="font-semibold text-zinc-900 emoji-container">
                          {decodeEmojiFromStorage(session.userInfo?.firstName || '')} {decodeEmojiFromStorage(session.userInfo?.lastName || '')}
                        </p>
                      )}
                    </div>

                    {session.userInfo && session.userInfo.premium && (
                      <span className="ml-auto bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">Premium</span>
                    )}
                  </div>

                  <p className="text-sm text-zinc-500 mb-3">
                    Created: {new Date(session.created).toLocaleString()}
                  </p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchGroups(session.phone)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-900 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                      disabled={loadingGroups}
                    >
                      {loadingGroups && selectedPhone === session.phone ? "Loading..." : "View Groups"}
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.phone)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                      disabled={deletingSession === session.phone}
                    >
                      {deletingSession === session.phone ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    {selectedGroups.length > 0 && (
                      <button 
                        onClick={clearSelectedGroups}
                        className="text-sm text-zinc-500 hover:text-zinc-700"
                      >
                        Clear selection ({selectedGroups.length})
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-60 overflow-y-auto">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          selectedGroups.includes(group.id)
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                        }`}
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
                                {group.isChannel ? "Channel" : "Group"} • {group.participantsCount.toLocaleString()} {group.isChannel ? "subscribers" : "members"}
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
                                  ? 'bg-blue-500 border-blue-500 text-white'
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

                <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 mb-4">
                  <h3 className="text-lg font-medium text-zinc-900 mb-3">Compose Message</h3>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Enter your message here..."
                  ></textarea>

                  <div className="flex items-center my-3">
                    <input
                      type="checkbox"
                      id="randomize"
                      checked={randomize}
                      onChange={(e) => setRandomize(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
                    />
                    <label htmlFor="randomize" className="ml-2 block text-sm text-zinc-700">
                      Add random emoji variations to messages
                    </label>
                  </div>

                  <button
                    onClick={sendMessage}
                    disabled={sendingMessage || selectedGroups.length === 0 || !message.trim()}
                    className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                      sendingMessage || selectedGroups.length === 0 || !message.trim()
                        ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    {sendingMessage ? "Sending..." : `Send to ${selectedGroups.length} groups`}
                  </button>

                  {sendProgress && (
                    <div className="mt-4 p-4 bg-zinc-100 rounded-lg border border-zinc-200">
                      <p className="text-sm text-zinc-700">
                        {sendProgress.status === 'complete' &&
                          `Complete: ${sendProgress.successful} successful, ${sendProgress.failed} failed`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {messageResults && (
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-4">Message Results</h2>
            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
              <p className="font-medium mb-2 text-zinc-800">
                Successfully sent to {messageResults.successful.length} groups,
                failed for {messageResults.failed.length} groups
              </p>
              {messageResults.failed.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-600 mb-1">Failed groups:</p>
                  <ul className="text-sm text-zinc-600 list-disc pl-5">
                    {messageResults.failed.map((result: MessageResult, index: number) => (
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
