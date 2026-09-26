import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or browser localStorage
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('kanan_supabase_url') || '' : '';
const localKey = typeof window !== 'undefined' ? localStorage.getItem('kanan_supabase_key') || '' : '';

export const SUPABASE_URL = localUrl || envUrl;
export const SUPABASE_ANON_KEY = localKey || envKey;

// A valid project URL has format https://<project-ref>.supabase.co
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('your-project-id')
);

// Create Supabase client instance
export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    supabase = null;
  }
}

/**
 * Update Supabase credentials dynamically from the UI
 */
export function saveSupabaseCredentials(url: string, key: string): { success: boolean; message: string } {
  try {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl.startsWith('https://')) {
      return { success: false, message: 'Supabase URL must start with https://' };
    }
    if (!cleanKey) {
      return { success: false, message: 'Anon API key cannot be empty' };
    }

    localStorage.setItem('kanan_supabase_url', cleanUrl);
    localStorage.setItem('kanan_supabase_key', cleanKey);

    // Reinitialize client
    supabase = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: true },
    });

    return { success: true, message: 'Supabase credentials saved successfully!' };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Error configuring Supabase' };
  }
}

/**
 * Remove custom Supabase credentials from localStorage
 */
export function resetSupabaseCredentials() {
  localStorage.removeItem('kanan_supabase_url');
  localStorage.removeItem('kanan_supabase_key');
  window.location.reload();
}

/**
 * Quick diagnostic ping to verify Supabase database table connectivity
 */
export async function pingSupabase(): Promise<{ connected: boolean; latencyMs: number; error?: string }> {
  if (!supabase) {
    return { connected: false, latencyMs: 0, error: 'Supabase client is not initialized.' };
  }

  const start = performance.now();
  try {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      return { connected: false, latencyMs, error: error.message };
    }
    return { connected: true, latencyMs };
  } catch (err: any) {
    return { connected: false, latencyMs: 0, error: err.message || 'Network error' };
  }
}
