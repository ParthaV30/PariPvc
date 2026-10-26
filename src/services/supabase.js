import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://roymaxvvjczwvidpmiiw.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || 
                    process.env.REACT_APP_SUPABASE_ANON_KEY || 
                    'sb_publishable_CKc-34WGqBLXuO90JP6ccg_kmn9vGpM';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;
