'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Lock } from 'lucide-react';

interface Payment {
  date: string;
  amount: number;
}

interface UserMetadata {
  payments?: Payment[];
  totalSpent?: number;
  websites?: string[];
}

interface User {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  metadata?: UserMetadata;
  lastSignInAt: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
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
      // Sort users: those with metadata first, then by creation date
      const sortedUsers = data.users.sort((a: User, b: User) => {
        const aHasMetadata = hasUserMetadata(a);
        const bHasMetadata = hasUserMetadata(b);
        
        if (aHasMetadata && !bHasMetadata) return -1;
        if (!aHasMetadata && bHasMetadata) return 1;
        
        // If both have or don't have metadata, sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setUsers(sortedUsers);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a user has any meaningful metadata
  const hasUserMetadata = (user: User) => {
    return !!(
      user.metadata?.payments && user.metadata.payments.length > 0 ||
      user.metadata?.websites && user.metadata.websites.length > 0 ||
      user.metadata?.totalSpent
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
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Users</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {users.filter(hasUserMetadata).length} users with activity / {users.length} total
            </p>
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
                <img
                  src={user.imageUrl}
                  alt={user.username || 'User'}
                  className="w-12 h-12 rounded-full"
                />
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
                      Joined {formatDistanceToNow(new Date(user.createdAt))} ago
                    </span>
                  </div>
                  
                  {/* Metadata Section */}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Premium Status */}
                    <div className="bg-zinc-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-zinc-600 mb-1">Premium Status</h3>
                      <p className="text-zinc-900">
                        {user.metadata?.payments && user.metadata.payments.length > 0 ? 'Premium' : 'Free'}
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
                        {user.metadata?.websites?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Payment History */}
                  {user.metadata?.payments && user.metadata.payments.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-zinc-600 mb-2">Payment History</h3>
                      <div className="bg-zinc-50 rounded-lg p-4">
                        <div className="space-y-2">
                          {user.metadata.payments.map((payment: Payment, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-zinc-600">
                                {new Date(payment.date).toLocaleDateString()}
                              </span>
                              <span className="font-medium text-zinc-900">
                                {payment.amount} SOL
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
