import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for data fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

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
 * Get a single post by ID
 */
export async function getPost(id: string): Promise<Post | null> {
  try {
    const { data, error } = await supabaseServer
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('published', true) // Only published posts for public view
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

/**
 * Get all published posts (for generateStaticParams)
 */
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabaseServer
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching published posts:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getPublishedPosts:', err);
    return [];
  }
}

/**
 * Get post IDs for static generation
 */
export async function getPostIds(): Promise<string[]> {
  try {
    const { data, error } = await supabaseServer
      .from('posts')
      .select('id')
      .eq('published', true);

    if (error) {
      console.error('Error fetching post IDs:', error);
      return [];
    }

    return data?.map(post => post.id) || [];
  } catch (err) {
    console.error('Error in getPostIds:', err);
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

