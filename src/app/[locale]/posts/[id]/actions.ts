'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

type Post = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  published: boolean;
};

/**
 * Get post by ID with RLS (uses user session from cookies)
 * - Public users can only see published posts
 * - Authenticated users can see their own drafts
 */
export async function getPost(id: string): Promise<Post | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getPost:', err);
    return null;
  }
}

