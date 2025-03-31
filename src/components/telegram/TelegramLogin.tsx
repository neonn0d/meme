'use client';

import { useState } from 'react';

// Define TypeScript interface for user info
interface TelegramUserInfo {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  photo: string | null;
  premium: boolean;
  verified: boolean;
  scam: boolean;
  fake: boolean;
  bot: boolean;
}

export default function TelegramLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [sessionInfo, setSessionInfo] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'code' | 'password' | 'success'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<TelegramUserInfo | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/telegram/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      setSessionInfo(data.sessionInfo);
      setStep('code');
      setSuccess('Verification code sent to your Telegram account');
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Include the password in the request even if it's empty
      const response = await fetch('/api/telegram/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, password, sessionInfo }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }
      
      if (data.requires2FA) {
        // 2FA is required, move to password step
        setSessionInfo(data.sessionInfo);
        setStep('password');
        setSuccess('Please enter your 2FA password');
      } else {
        // Login successful
        setStep('success');
        setSuccess('Successfully logged in to Telegram');
        
        // Save user info if available
        if (data.userInfo) {
          setUserInfo(data.userInfo);
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/telegram/dashboard';
        }, 3000);
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/telegram/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: '', password, sessionInfo }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify 2FA password');
      }
      
      // Login successful
      setStep('success');
      setSuccess('Successfully logged in to Telegram with 2FA');
      
      // Save user info if available
      if (data.userInfo) {
        setUserInfo(data.userInfo);
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/telegram/dashboard';
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Connect to Telegram</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-zinc-700 mb-1">
              Phone Number (with country code)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
              loading ? 'bg-zinc-400' : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-zinc-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="12345"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              2FA Password (if you have one)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Optional 2FA password"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-zinc-500 mt-1">
              If you have 2FA enabled, enter your password here to login in one step
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
              loading ? 'bg-zinc-400' : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full py-2 px-4 rounded-lg border border-zinc-300 bg-white text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
          >
            Back
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Two-Factor Authentication Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your 2FA password"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
              loading ? 'bg-zinc-400' : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify Password'}
          </button>
          <button
            type="button"
            onClick={() => setStep('code')}
            className="w-full py-2 px-4 rounded-lg border border-zinc-300 bg-white text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
          >
            Back
          </button>
        </form>
      )}

      {step === 'success' && userInfo && (
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-50 border border-zinc-200 flex items-center justify-center">
              <svg
                className="h-12 w-12"
                fill="#0088cc"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.12.13.145.309.164.472-.001.089.016.181.003.288z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-zinc-900">
              {userInfo.username ? `@${userInfo.username}` : `${userInfo.firstName} ${userInfo.lastName}`}
            </h3>
            <p className="text-zinc-600">{userInfo.phone}</p>
            {userInfo.premium && (
              <span className="inline-block mt-2 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200">
                Premium
              </span>
            )}
          </div>
          <p className="text-green-600 font-medium">
            Successfully connected your Telegram account
          </p>
          <p className="text-zinc-500 text-sm">
            Redirecting to dashboard...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
