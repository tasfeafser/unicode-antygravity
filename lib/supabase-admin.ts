import { createClient } from '@supabase/supabase-js';

// Admin client bypasses RLS - use ONLY for server-side tasks like webhooks
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
