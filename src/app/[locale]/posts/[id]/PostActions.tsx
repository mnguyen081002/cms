'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';

type PostActionsProps = {
  postId: string;
  authorId: string;
};

export function PostActions({ postId, authorId }: PostActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('PostDetail');
  const supabase = createClient();

  const isAuthor = user?.id === authorId;

  const handleDelete = async () => {
    if (!confirm(t('delete_confirm'))) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (deleteError) {
        throw deleteError;
      }
      router.push('/dashboard');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(t('delete_failed'));
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
      <Button variant="outline" onClick={handleDelete} className="border-red-600 text-red-600 hover:bg-red-50">
        {t('delete_post')}
      </Button>
    </div>
  );
}

