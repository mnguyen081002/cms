import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
  maxLength?: number;
  className?: string;
}

/**
 * Markdown Preview Component
 * 
 * Renders markdown content with custom styling for preview cards.
 * Includes gradient overlay for fade effect.
 */
export function MarkdownPreview({ content, maxLength = 200, className = '' }: MarkdownPreviewProps) {
  const getContentPreview = (text: string, max: number) => {
    if (text.length <= max) {
      return text;
    }
    const trimmed = text.substring(0, max);
    const lastSpace = trimmed.lastIndexOf(' ');
    if (lastSpace > 0) {
      return `${trimmed.substring(0, lastSpace)}...`;
    }
    return `${trimmed}...`;
  };

  return (
    <div className={`relative max-h-[4.5rem] overflow-hidden ${className}`}>
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-heading mb-1 text-sm font-semibold" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-heading mb-1 text-sm font-semibold" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-heading mb-1 text-xs font-semibold" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-1 text-sm leading-relaxed text-gray-600" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="mb-1 ml-4 list-disc text-sm text-gray-600" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="mb-1 ml-4 list-decimal text-sm text-gray-600" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-sm" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-800" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-accent mb-1 border-l-2 pl-2 text-sm text-gray-600 italic" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-gray-800" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="italic" {...props} />
            ),
          }}
        >
          {getContentPreview(content, maxLength)}
        </ReactMarkdown>
      </div>
      {/* Gradient overlay for fade effect */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

