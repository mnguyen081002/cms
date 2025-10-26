import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Markdown Renderer Component
 * 
 * Unified markdown rendering with consistent styling across the application.
 * Used for:
 * - Post detail pages (posts/[id])
 * - Edit/Create preview tabs
 * - Any other markdown content display
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-heading mb-4 mt-6 text-3xl font-bold" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-heading mb-3 mt-6 text-2xl font-semibold" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-heading mb-2 mt-4 text-xl font-semibold" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-heading mb-2 mt-3 text-lg font-semibold" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-heading mb-2 mt-3 text-base font-semibold" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-heading mb-2 mt-3 text-sm font-semibold" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-body mb-4 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a 
              className="text-accent font-medium hover:underline" 
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props} 
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="rounded bg-gray-200 px-2 py-1 font-mono text-sm text-gray-800" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-800 p-4 text-gray-100" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-accent mb-4 border-l-4 pl-4 italic text-gray-600" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-gray-300" {...props} />
          ),
          img: ({ node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="my-4 rounded-lg" alt={props.alt || ''} {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-gray-200 bg-white" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
