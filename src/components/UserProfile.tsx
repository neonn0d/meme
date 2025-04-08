'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/AuthContext';
import { truncateAddress } from '@/lib/utils';
import { WebsiteGeneration } from '@/types/website-generation';
import Link from 'next/link';

interface UserProfileProps {
  editable?: boolean;
  className?: string;
}

export function UserProfile({ editable = true, className = '' }: UserProfileProps) {
  const { publicKey } = useWallet();
  const { userProfile, refreshUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [websiteHistory, setWebsiteHistory] = useState<WebsiteGeneration[]>([]);
  const [totalGenerated, setTotalGenerated] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user profile data when component mounts or profile changes
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name || '');
      setBio(userProfile.bio || '');
      fetchUserWebsiteData();
    }
  }, [userProfile]);
  
  // Fetch user's website generation history and payment data
  const fetchUserWebsiteData = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/websites', {
        headers: {
          'Authorization': `Bearer ${publicKey.toString()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch website data');
      }
      
      const data = await response.json();
      setWebsiteHistory(data.websites || []);
      setTotalGenerated(data.totalGenerated || 0);
      setTotalSpent(data.totalSpent || 0);
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching website data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!publicKey) return;
    
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicKey.toString()}`
        },
        body: JSON.stringify({
          display_name: displayName,
          bio: bio
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      await refreshUserProfile();
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form values to current profile values
    if (userProfile) {
      setDisplayName(userProfile.display_name || '');
      setBio(userProfile.bio || '');
    }
    setIsEditing(false);
    setSaveError('');
  };

  if (!userProfile) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        {editable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="p-6">
        {saveSuccess && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            Profile updated successfully!
          </div>
        )}
        
        {saveError && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
            {saveError}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Wallet Address (always read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address
            </label>
            <div className="flex items-center">
              <span className="text-gray-900 font-mono">
                {publicKey ? truncateAddress(publicKey.toString()) : 'Not connected'}
              </span>
              {publicKey && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publicKey.toString());
                    // Could add a toast notification here
                  }}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy
                </button>
              )}
            </div>
          </div>
          
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your display name"
                maxLength={50}
              />
            ) : (
              <p className="text-gray-900">{displayName || 'Not set'}</p>
            )}
          </div>
          
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Tell us about yourself"
                maxLength={200}
              />
            ) : (
              <p className="text-gray-900">{bio || 'Not set'}</p>
            )}
          </div>
          
          {/* Subscription Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subscription Status
            </label>
            <p className="text-gray-900">
              {userProfile?.subscription?.status === 'active' ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Premium
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Free
                </span>
              )}
            </p>
          </div>
          
          {/* Websites Generated */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Websites Generated
            </label>
            <p className="text-gray-900">{userProfile?.public_metadata?.total_generated || 0}</p>
          </div>
          
          {/* Edit mode buttons */}
          {isEditing && (
            <div className="flex space-x-3 pt-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          )}
          
          {/* Website Generation History */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Website Generation History</h3>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Websites Generated</span>
                    <p className="text-2xl font-bold text-gray-900">{totalGenerated}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Spent</span>
                    <p className="text-2xl font-bold text-gray-900">{totalSpent} SOL</p>
                  </div>
                </div>
                
                {websiteHistory.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Websites</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin Name</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {websiteHistory.slice(0, 5).map((website, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{website.coinName || 'Unknown'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{website.tokenSymbol || '-'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(website.timestamp).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No websites generated yet.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Payment History */}
          {payments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Payment History</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{payment.amount} SOL</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                          {payment.explorer_url ? (
                            <a href={payment.explorer_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              View Transaction
                            </a>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Actions */}
          {isEditing && (
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
          
          {/* Generate New Website Button */}
          <div className="mt-8 flex justify-center">
            <Link href="/customize" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
              Generate New Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
