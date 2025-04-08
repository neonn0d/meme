'use client';

import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the TelegramLoginContainer with no SSR
const TelegramLoginContainer = dynamic(
  () => import('@/components/telegram/TelegramLoginContainer'),
  { ssr: false }
);

export default function TelegramLoginPage() {
  const { isLoading, isSignedIn, userProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-full bg-white pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8 py-12">
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
            <div className="rounded-full flex items-center justify-center" style={{ width: '60px', height: '60px' }}>
              <svg className="h-15 w-15 text-zinc-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.12.13.145.309.164.472-.001.089.016.181.003.288z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Connect Your Telegram Account</h1>
          <p className="text-zinc-600">Add your Telegram account to send messages to groups and channels.</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden mb-8">
          <Suspense fallback={<div className="text-center py-10">Loading login form...</div>}>
            <TelegramLoginContainer />
          </Suspense>
        </div>

        {/* Why Connect Section */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <h3 className="font-medium text-zinc-900 mb-4">Why connect your Telegram?</h3>
          <ul className="list-disc pl-5 space-y-2 text-zinc-600">
            <li>Send messages to multiple groups at once</li>
            <li>Manage your Telegram sessions securely</li>
            <li>Access advanced messaging features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
