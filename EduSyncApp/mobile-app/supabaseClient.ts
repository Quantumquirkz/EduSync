/**
 * EduSync - Cliente Supabase
 * Configuración del cliente para conexión a base de datos
 * @author EduSync Team
 * @version 1.0.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * Cliente Supabase configurado para React Native
 * - Persistencia de sesión con AsyncStorage
 * - Auto-refresh de tokens
 * - Configuración para móvil
 */

// Procesar credenciales
const url = SUPABASE_URL?.trim();
const key = SUPABASE_ANON_KEY?.trim();

// Validar credenciales
if (!url || !key) {
  console.error('[Supabase] Missing credentials: set SUPABASE_URL and SUPABASE_ANON_KEY in config.ts');
}

// Logs de debug (enmascarados)
console.log(`[Supabase] Initializing with URL: ${url}`);
console.log(`[Supabase] Using anon key starts with: ${key?.slice(0, 5)}...`);

// Crear cliente
let supabase;
try {
  supabase = createClient(
    url || '',
    key || '',
    {
      auth: {
        storage: AsyncStorage,           // Persistencia
        autoRefreshToken: true,          // Auto-refresh
        persistSession: true,            // Mantener sesión
        detectSessionInUrl: false,       // No detectar en URL (móvil)
      },
      global: {
        fetch: globalThis.fetch,         // Fetch global
        WebSocket: globalThis.WebSocket, // WebSocket global
      },
    }
  );

  console.log('[Supabase] Client initialized successfully');
} catch (error) {
  console.error('[Supabase] Error creating client', error);
}

export default supabase;