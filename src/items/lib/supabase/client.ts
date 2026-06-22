import { createClient } from '@supabase/supabase-js';

/** Singleton Supabase admin client initialized from environment config. */
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
