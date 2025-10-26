/**
 * useAuthRedirect Hook
 * 
 * Custom hook to handle authentication redirect logic.
 * Redirects to login page if user is not authenticated.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/context';

/**
 * Hook to redirect unauthenticated users to login page
 * 
 * @param redirectTo - Path to redirect to after login (default: current path)
 * @returns Object with user and loading state
 */
export function useAuthRedirect(redirectTo?: string) {
  const { user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      const loginPath = redirectTo 
        ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
        : '/auth/login';
      router.push(loginPath);
    } else {
      setIsChecking(false);
    }
  }, [user, router, redirectTo]);

  return {
    user,
    isChecking,
  };
}

