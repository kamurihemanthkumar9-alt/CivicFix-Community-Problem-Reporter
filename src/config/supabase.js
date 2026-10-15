import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or runtime localStorage override
export const getSupabaseConfig = () => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined;
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;
  const localUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('civicfix_supabase_url') : null;
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('civicfix_supabase_key') : null;

  const url = (localUrl && localUrl.trim()) || (envUrl && envUrl.trim()) || '';
  const key = (localKey && localKey.trim()) || (envKey && envKey.trim()) || '';

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('your-project-id') &&
    !key.includes('your-anon-key')
  );

  return { url, key, isConfigured };
};

export const saveRuntimeSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('civicfix_supabase_url', url.trim());
    localStorage.setItem('civicfix_supabase_key', key.trim());
  } else {
    localStorage.removeItem('civicfix_supabase_url');
    localStorage.removeItem('civicfix_supabase_key');
  }
};

let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};
