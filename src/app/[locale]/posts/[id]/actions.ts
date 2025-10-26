'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Server Actions for Post Detail Page
 *
 * These actions are called from the client-side components
 * and run on the server with user authentication context.
 */

/**
 * Delete a post (only author can delete)
 *
 * @param postId - Post ID to delete
 * @returns Success status and error message if any
 */
export async function deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // RLS will automatically check if user is the author
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      console.error('[deletePost] Error:', error);
      return { success: false, error: error.message };
    }

    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath('/posts');
    revalidatePath(`/posts/${postId}`);

    return { success: true };
  } catch (err) {
    console.error('[deletePost] Exception:', err);
    return { success: false, error: 'Failed to delete post' };
  }
}

/**
 * Toggle post published status (only author can toggle)
 *
 * @param postId - Post ID
 * @param published - New published status
 * @returns Success status and error message if any
 */
export async function togglePublished(
  postId: string,
  published: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // RLS will automatically check if user is the author
    const { error } = await supabase.from('posts').update({ published }).eq('id', postId);

    if (error) {
      console.error('[togglePublished] Error:', error);
      return { success: false, error: error.message };
    }

    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath('/posts');
    revalidatePath(`/posts/${postId}`);

    return { success: true };
  } catch (err) {
    console.error('[togglePublished] Exception:', err);
    return { success: false, error: 'Failed to update post' };
  }
}

