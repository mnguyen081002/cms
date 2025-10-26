/**
 * useFormState Hook
 * 
 * Custom hook to manage form state (loading, error, success).
 */

'use client';

import { useState } from 'react';

export interface FormState {
  loading: boolean;
  error: string;
  success: boolean;
}

export interface FormStateActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (success: boolean) => void;
  reset: () => void;
}

/**
 * Hook to manage form state
 * 
 * @returns Object with state and actions
 */
export function useFormState(): FormState & FormStateActions {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setLoading(false);
    setError('');
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    setLoading,
    setError,
    setSuccess,
    reset,
  };
}

