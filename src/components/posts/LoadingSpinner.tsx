interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Loading Spinner Component
 * 
 * Displays a centered loading spinner with optional message.
 */
export function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className={`mx-auto mb-4 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`} />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

