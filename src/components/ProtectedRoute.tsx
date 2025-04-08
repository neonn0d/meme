'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredSubscription?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredSubscription = false 
}: ProtectedRouteProps) {
  const { isSignedIn, isLoading, userProfile } = useAuth();
  const router = useRouter();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Only redirect if we're sure the user is not signed in and we've finished loading
  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      // Get the current path to redirect back after sign-in
      const currentPath = window.location.pathname;
      console.log('ProtectedRoute: User not signed in, redirecting to sign-in with return path:', currentPath);
      
      // Redirect to sign-in with the return URL as a query parameter
      router.replace(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isSignedIn, isLoading, router]);

  // If not signed in but still in the process of redirecting, show loading state
  // This prevents the brief flash of content before redirect
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Checking authentication...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Check subscription if required
  if (requiredSubscription) {
    const hasActiveSubscription = userProfile?.subscription?.status === 'active';
    
    if (!hasActiveSubscription) {
      console.log('ProtectedRoute: No active subscription, redirecting');
      router.replace('/payment-demo');
      return null;
    }
  }
  
  return <>{children}</>;
}
