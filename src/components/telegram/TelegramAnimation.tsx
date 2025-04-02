'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface TelegramAnimationProps {
  step?: 'phone' | 'code' | 'password' | 'success';
}

export default function TelegramAnimation({ step = 'phone' }: TelegramAnimationProps) {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Determine which animation to load based on the step
    let animationFile = '/animations/telegram-animation.json';
    
    if (step === 'code' || step === 'password') {
      animationFile = '/animations/telegram-verification.json';
    } else if (step === 'success') {
      animationFile = '/animations/telegram-success.json';
    }
    
    setIsLoading(true);
    
    // Dynamically load the animation data
    fetch(animationFile)
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading animation:', error);
        setIsLoading(false);
      });
  }, [step]);

  if (isLoading || !animationData) {
    return <div className="w-full h-48 flex items-center justify-center">Loading animation...</div>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="relative" style={{ 
        width: step === 'code' || step === 'password' ? '300px' : '200px',
        height: step === 'code' || step === 'password' ? '300px' : '200px',
      }}>
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: step === 'code' || step === 'password' 
            ? 'translate(-50%, -50%) scale(1.8)' 
            : 'translate(-50%, -50%)',
          width: '100%',
          height: '100%'
        }}>
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
          />
        </div>
      </div>
    </div>
  );
}
