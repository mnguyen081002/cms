'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/context';
import { deletePost } from './actions';

type PostActionsProps = {
  postId: string;
  authorId: string;
};

export function PostActions({ postId, authorId }: PostActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('PostDetail');
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user?.id === authorId;

  const handleDelete = async () => {
    if (!confirm(t('delete_confirm'))) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deletePost(postId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete post');
      }

      router.push('/dashboard');
      router.refresh(); // Refresh to update the UI
    } catch (err) {
      console.error('[PostActions] Delete error:', err);
      alert(t('delete_failed'));
      setIsDeleting(false);
    }
  };

  if (!isAuthor) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <Link href={`/dashboard/${postId}/edit`}>
        <Button variant="primary">{t('edit_post')}</Button>
      </Link>
      <Button
        variant="outline"
        onClick={handleDelete}
        disabled={isDeleting}
        className="border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : t('delete_post')}
      </Button>
    </div>
  );
}

