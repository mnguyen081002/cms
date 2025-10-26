import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { Env } from '../Env';

/**
 * Create Supabase client for Server Components and Server Actions
 * This function creates a new client for each request with the user's session from cookies
 *
 * Usage:
 * ```ts
 * const supabase = await createServerSupabaseClient();
 * const { data } = await supabase.from('posts').select('*');
 * ```
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    Env.NEXT_PUBLIC_SUPABASE_URL!,
    Env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

/**
 * Create Supabase client for static generation (no cookies)
 * Use this for generateStaticParams, sitemap, etc.
 *
 * Note: This client has no user session, so RLS will only allow public data
 *
 * Usage:
 * ```ts
 * const supabase = createStaticSupabaseClient();
 * const { data } = await supabase.from('posts').select('*');
 * ```
 */
export function createStaticSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

