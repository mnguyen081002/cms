import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import type { Post } from '@/types/post';
import { MarkdownPreview } from './MarkdownPreview';

interface PostCardProps {
  post: Post;
  formatDate: (date: string) => string;
  variant?: 'public' | 'dashboard';
  onDelete?: (postId: string) => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  publishedLabel?: string;
  draftLabel?: string;
  updatedLabel?: string;
}

/**
 * Post Card Component
 * 
 * Displays a post card with title, content preview, and metadata.
 * Supports two variants:
 * - 'public': For public blog listing (no actions)
 * - 'dashboard': For user dashboard (with view/edit/delete actions)
 */
export function PostCard({
  post,
  formatDate,
  variant = 'public',
  onDelete,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  publishedLabel = 'Published',
  draftLabel = 'Draft',
  updatedLabel = 'Updated',
}: PostCardProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
    }
  };

  if (variant === 'dashboard') {
    return (
      <Card
        variant="elevated"
        className="group relative flex flex-col transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Status Badge */}
        <div className="absolute right-4 top-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
            post.published
              ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20'
              : 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20'
          }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${
              post.published ? 'bg-green-600' : 'bg-yellow-600'
            }`}
            />
            {post.published ? publishedLabel : draftLabel}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Link href={`/posts/${post.id}`}>
            <h2 className="text-heading hover:text-accent mb-3 pr-24 text-xl font-bold transition-colors duration-200 line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {post.content && (
            <MarkdownPreview content={post.content} maxLength={200} className="mb-4" />
          )}

          {/* Meta Information */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.updated_at !== post.created_at && (
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{updatedLabel} {formatDate(post.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-gray-100 pt-4">
          {/* View button - Only shown for published posts */}
          {post.published && (
            <Link href={`/posts/${post.id}`} className="flex-1">
              <button className="group/btn flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                <svg className="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{viewLabel}</span>
              </button>
            </Link>
          )}
          {/* Edit button - Always shown */}
          <Link href={`/dashboard/${post.id}/edit`} className="flex-1">
            <button className="group/btn flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700">
              <svg className="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>{editLabel}</span>
            </button>
          </Link>
          {/* Delete button - Always shown */}
          <button
            onClick={handleDelete}
            className="group/btn flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
            title={deleteLabel}
          >
            <svg className="h-4 w-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </Card>
    );
  }

  // Public variant
  return (
    <Link href={`/posts/${post.id}`}>
      <Card
        variant="elevated"
        className="group flex h-full cursor-pointer flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        {/* Title */}
        <h2 className="text-heading hover:text-accent mb-3 text-xl font-bold transition-colors duration-200 line-clamp-2">
          {post.title}
        </h2>

        {/* Content Preview with Markdown */}
        {post.content && (
          <MarkdownPreview content={post.content} maxLength={200} className="mb-4 flex-1" />
        )}

        {/* Meta Information */}
        <div className="mt-auto border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

