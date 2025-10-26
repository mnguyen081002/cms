/**
 * Success Alert Component
 * 
 * Reusable success alert component for displaying success messages.
 */

interface SuccessAlertProps {
  message: string;
  className?: string;
}

export function SuccessAlert({ message, className = '' }: SuccessAlertProps) {
  if (!message) return null;
  
  return (
    <div className={`rounded-lg border border-green-200 bg-green-50 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <svg 
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <p className="text-sm text-green-700">{message}</p>
      </div>
    </div>
  );
}

