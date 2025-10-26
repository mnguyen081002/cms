import { createServerSupabaseClient, createStaticSupabaseClient } from '@/lib/supabase/server';
import type { Post } from '@/types/post';

/**
 * Posts Repository - Server-side data fetching
 *
 * This module provides data access functions for posts.
 * All functions use RLS (Row Level Security) for access control.
 *
 * RLS Policies:
 * - Public users: Can only see published posts
 * - Authenticated users: Can see published posts + their own drafts
 *
 * Note: Functions used in static generation (sitemap, generateStaticParams)
 * use createStaticSupabaseClient() to avoid cookies dependency.
 */

/**
 * Get a single post by ID with RLS
 *
 * @param id - Post ID
 * @returns Post if found and accessible, null otherwise
 *
 * Access:
 * - Public: Only published posts
 * - Authenticated: Published posts + own drafts
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[getPostById] Error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('[getPostById] Exception:', err);
    return null;
  }
}

/**
 * Get all published posts (for public listing)
 *
 * @returns Array of published posts, ordered by created_at DESC
 *
 * Note: This explicitly filters for published = true
 * Use this for public-facing pages like blog listing, sitemap, etc.
 * Uses static client (no cookies) for static generation compatibility.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    // Use static client for sitemap/generateStaticParams compatibility
    const supabase = createStaticSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true) // Explicit filter for public access
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getPublishedPosts] Error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[getPublishedPosts] Exception:', err);
    return [];
  }
}

/**
 * Get post IDs for static generation (generateStaticParams)
 *
 * @returns Array of post IDs for published posts only
 *
 * Note: Only returns published posts for static generation
 * Draft posts are handled via dynamicParams = true
 * Uses static client (no cookies) for static generation compatibility.
 */
export async function getPostIds(): Promise<string[]> {
  try {
    // Use static client for generateStaticParams compatibility
    const supabase = createStaticSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .eq('published', true); // Only published posts for static generation

    if (error) {
      console.error('[getPostIds] Error:', error);
      return [];
    }

    return data?.map((post) => post.id) || [];
  } catch (err) {
    console.error('[getPostIds] Exception:', err);
    return [];
  }
}

/**
 * Generate excerpt from markdown content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).trim()}...`;
}

