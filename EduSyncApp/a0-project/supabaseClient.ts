import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * Supabase client configured with Expo AsyncStorage for auth persistence.
 */
const url = SUPABASE_URL?.trim();
const key = SUPABASE_ANON_KEY?.trim();
if (!url || !key) {
  console.error('[Supabase] Missing credentials: please set SUPABASE_URL and SUPABASE_ANON_KEY in config.ts');
}

// Masked logging for debugging
console.log(`[Supabase] Initializing with URL: ${url}`);
console.log(`[Supabase] Using anon key starts with: ${key?.slice(0, 5)}...`);

// Create client with trimmed credentials
let supabase;
try {
  supabase = createClient(
    url || '',
    key || '',
    {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        fetch: globalThis.fetch,
        WebSocket: globalThis.WebSocket,
      },
    }
  );

  // Debug logs for successful initialization
  console.log('[Supabase] Client initialized successfully');
} catch (error) {
  console.error('[Supabase] Error creating client', error);
}

export default supabase;
// End of supabaseClient.ts