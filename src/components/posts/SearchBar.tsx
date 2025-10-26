import { Input } from '@/components/ui/Input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Search Bar Component
 * 
 * Displays a search input with search icon.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-12"
      />
    </div>
  );
}

