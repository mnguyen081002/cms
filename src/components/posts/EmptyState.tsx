import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'document' | 'search';
}

/**
 * Empty State Component
 * 
 * Displays an empty state with icon, title, description, and optional action button.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'document',
}: EmptyStateProps) {
  const renderIcon = () => {
    if (icon === 'search') {
      return (
        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    }
    return (
      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <Card className="py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        {renderIcon()}
      </div>
      <h3 className="text-heading mb-2 text-xl font-semibold">
        {title}
      </h3>
      <p className="mb-6 text-gray-600">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}

