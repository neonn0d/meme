'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Lock } from 'lucide-react';

interface Payment {
  type: string;
  amount: number;
  status: string;
  network: string;
  timestamp: number;
  expiryDate: number;
  transactionHash: string;
}

interface Website {
  price?: number;
  timestamp: string;
  transactionHash?: string;
}

interface UserMetadata {
  payments?: Payment[];
  websites?: Website[];
  totalSpent?: number;
  totalGenerated?: number;
}

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan: string;
  current_period_start: string;
  current_period_end: string;
  payment_info: {
    amount: number;
    network: string;
    transactionHash: string;
  };
}

interface User {
  id: string;
  username: string | null;
  wallet_address: string;
  metadata?: UserMetadata;
  subscriptions?: Subscription[];
  payments?: Payment[];
  last_sign_in_at?: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    usersWithWebsites: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        headers: {
          'X-Admin-Password': password
        }
      });
      
      if (!response.ok) {
        throw new Error('Invalid password');
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      // Sort users: those with metadata first, then by creation date
      const sortedUsers = data.users.sort((a: User, b: User) => {
        const aHasMetadata = hasUserMetadata(a);
        const bHasMetadata = hasUserMetadata(b);
        
        if (aHasMetadata && !bHasMetadata) return -1;
        if (!aHasMetadata && bHasMetadata) return 1;
        
        // If both have or don't have metadata, sort by creation date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setUsers(sortedUsers);
      setStats(data.stats);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a user has any meaningful data
  const hasUserMetadata = (user: User) => {
    const websites = user.metadata?.websites;
    const hasPayments = user.payments && user.payments.length > 0;
    const hasSubscriptions = user.subscriptions && user.subscriptions.length > 0;
    return !!(
      (websites && websites.length > 0) ||
      hasPayments ||
      hasSubscriptions ||
      user.metadata?.totalSpent ||
      user.metadata?.totalGenerated
    );
  };

  // Helper function to check if user has active premium
  const hasActivePremium = (user: User) => {
    const payments = user.metadata?.payments;
    if (!payments || payments.length === 0) return false;
    
    const latestPayment = payments[0];
    const expiryDate = new Date(latestPayment.expiryDate);
    return expiryDate > new Date();
  };

  // Function to check if a user has an active subscription
  const hasActiveSubscription = (user: User) => {
    if (!user.subscriptions || user.subscriptions.length === 0) return false;
    
    return user.subscriptions.some(sub => 
      sub.status === 'active' && 
      new Date(sub.current_period_end) > new Date()
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-zinc-100 rounded-full">
                <Lock className="w-6 h-6 text-zinc-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-zinc-900 mb-6">
              Admin Access Required
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-zinc-900 text-white py-2 px-4 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Access Users
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Active Users</h1>
            <div className="flex gap-2 text-sm text-zinc-500 mt-1">
              <span>{stats.premiumUsers} premium</span>
              <span>•</span>
              <span>{stats.usersWithWebsites} with websites</span>
              <span>•</span>
              <span>{stats.activeUsers} active total</span>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Lock Access
          </button>
        </div>
        
        <div className="grid gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className={`bg-white rounded-xl shadow-sm border ${
                hasUserMetadata(user) ? 'border-zinc-300' : 'border-zinc-200'
              } p-6`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center">
                  <span className="text-zinc-500 text-lg">👤</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-900">
                        {user.username || `${user.id|| ''} ${user.username || ''}`.trim() || 'Anonymous User'}
                      </h2>
                      {hasUserMetadata(user) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Active User
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-zinc-500">
                      {user.created_at ? (
                        <>Joined {formatDistanceToNow(new Date(user.created_at))} ago</>
                      ) : (
                        'Recently joined'
                      )}
                    </span>
                  </div>
                  
                  {/* Metadata Section */}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Premium Status */}
                    <div className="bg-zinc-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-zinc-600 mb-1">Premium Status</h3>
                      <p className="text-zinc-900">
                        {(() => {
                          if (hasActiveSubscription(user)) {
                            const activeSub = user.subscriptions!.find(sub => sub.status === 'active')!;
                            const expiryDate = new Date(activeSub.current_period_end);
                            return `Premium (expires ${formatDistanceToNow(expiryDate, { addSuffix: true })})`;
                          }
                          
                          // Check if user had a subscription that expired
                          const hasExpiredSub = user.subscriptions && user.subscriptions.length > 0;
                          
                          return hasExpiredSub ? 'Free (Premium expired)' : 'Free';
                        })()}
                      </p>
                    </div>
                    
                    {/* Total Spent */}
                    <div className="bg-zinc-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-zinc-600 mb-1">Total Spent</h3>
                      <p className="text-zinc-900">
                        {user.metadata?.totalSpent ? `${user.metadata.totalSpent} SOL` : '0 SOL'}
                      </p>
                    </div>
                    
                    {/* Websites Generated */}
                    <div className="bg-zinc-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-zinc-600 mb-1">Websites Generated</h3>
                      <p className="text-zinc-900">
                        {user.metadata?.totalGenerated || 0}
                      </p>
                    </div>
                  </div>

                  {/* Subscription History */}
                  {(() => {
                    const subscriptions = user.subscriptions;
                    if (!subscriptions || subscriptions.length === 0) return null;
                    
                    return (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-zinc-600 mb-2">Subscription History</h3>
                        <div className="bg-zinc-50 rounded-lg p-4">
                          <div className="space-y-2">
                            {subscriptions.map((subscription, index) => {
                              const startDate = new Date(subscription.current_period_start);
                              const endDate = new Date(subscription.current_period_end);
                              const isValidStartDate = !isNaN(startDate.getTime());
                              const isValidEndDate = !isNaN(endDate.getTime());
                              const hash = subscription.payment_info?.transactionHash;
                              
                              return (
                                <div key={index} className="flex justify-between text-sm">
                                  <div className="flex flex-col">
                                    <span className="text-zinc-600">
                                      {isValidStartDate 
                                        ? startDate.toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })
                                        : 'Invalid Date'}
                                    </span>
                                    {hash ? (
                                      <span className="text-xs text-zinc-500 truncate max-w-[200px]" title={hash}>
                                        {hash.slice(0, 8)}...{hash.slice(-8)}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-zinc-500">No transaction hash</span>
                                    )}
                                    {isValidEndDate ? (
                                      <span className="text-xs text-zinc-500">
                                        Expires: {formatDistanceToNow(endDate, { addSuffix: true })}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-zinc-500">
                                        No expiration date
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="font-medium text-zinc-900">
                                      {subscription.payment_info?.amount || 0} SOL
                                    </span>
                                    <span className="text-xs text-zinc-500 block">
                                      {subscription.status} ({subscription.plan})
                                    </span>
                                    <span className="text-xs text-zinc-500 block">
                                      {subscription.payment_info?.network || 'unknown'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Website History */}
                  {(() => {
                    const websites = user.metadata?.websites;
                    if (!websites || websites.length === 0) return null;
                    
                    return (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-zinc-600 mb-2">Website History</h3>
                        <div className="bg-zinc-50 rounded-lg p-4">
                          <div className="space-y-2">
                            {websites.map((website, index) => {
                              const timestamp = new Date(website.timestamp);
                              const isValidDate = !isNaN(timestamp.getTime());
                              const hash = website.transactionHash;
                              
                              return (
                                <div key={index} className="flex justify-between text-sm">
                                  <div className="flex flex-col">
                                    <span className="text-zinc-600">
                                      {isValidDate 
                                        ? timestamp.toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                          })
                                        : 'Invalid Date'}
                                    </span>
                                    {hash ? (
                                      <span className="text-xs text-zinc-500 truncate max-w-[200px]" title={hash}>
                                        {hash.slice(0, 8)}...{hash.slice(-8)}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-zinc-500">No transaction hash</span>
                                    )}
                                  </div>
                                  <span className="font-medium text-zinc-900">
                                    {website.price ? `${website.price} SOL` : 'Free'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
