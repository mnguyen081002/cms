import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

