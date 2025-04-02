'use client';

import { useState } from 'react';
import TelegramLogin from './TelegramLogin';
import TelegramAnimation from './TelegramAnimation';

export default function TelegramLoginContainer() {
  const [currentStep, setCurrentStep] = useState<'phone' | 'code' | 'password' | 'success'>('phone');

  // This function will be called by TelegramLogin to update the step
  const updateStep = (step: 'phone' | 'code' | 'password' | 'success') => {
    setCurrentStep(step);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Animation Side */}
      <div className="bg-zinc-50 flex items-center justify-center md:w-1/2 p-8">
        <div className="w-full max-w-[200px]">
          <TelegramAnimation step={currentStep} />
        </div>
      </div>
      
      {/* Login Form Side */}
      <div className="py-6 px-8 md:w-1/2">
        <h2 className="text-xl font-medium text-zinc-900 mb-12">Connect to Telegram</h2>
        <TelegramLogin onStepChange={updateStep} />
      </div>
    </div>
  );
}
