import { createBrowserClient } from '@supabase/ssr';
import { Env } from '../Env';

export const createClient = () =>
  createBrowserClient(
    Env.NEXT_PUBLIC_SUPABASE_URL!,
    Env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
