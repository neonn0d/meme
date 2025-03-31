'use client';

import { useUser } from '@clerk/nextjs';
import TelegramLogin from '@/components/telegram/TelegramLogin';

export default function TelegramLoginPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">You need to be signed in to access this page.</p>
          <a href="/sign-in" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pt-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="px-4 sm:px-0 py-6 sm:py-12 space-y-4 sm:space-y-8">
        {/* Header Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-zinc-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
            Connect Your Telegram Account
          </h1>
          <p className="mt-2 text-zinc-600">
            Add your Telegram account to send messages to groups and channels.
          </p>
        </div>

        {/* Login Component */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 max-w-xl mx-auto">
          <TelegramLogin />
        </div>
      </div>
    </div>
  );
}
