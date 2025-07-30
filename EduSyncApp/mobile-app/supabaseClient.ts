/**
 * EduSync - Cliente de Supabase
 * 
 * Este archivo configura y exporta el cliente de Supabase para la aplicación EduSync.
 * Supabase es una plataforma de backend-as-a-service que proporciona base de datos,
 * autenticación y API REST automática.
 * 
 * Funcionalidades:
 * - Configuración del cliente Supabase con AsyncStorage
 * - Manejo de credenciales y validación
 * - Configuración de autenticación persistente
 * - Logging para debugging
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importación de AsyncStorage para persistencia de sesión en React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importación del cliente de Supabase
import { createClient } from '@supabase/supabase-js';

// Importación de las credenciales de configuración
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * Configuración del cliente Supabase con Expo AsyncStorage para persistencia de autenticación.
 * 
 * El cliente se configura con:
 * - AsyncStorage para persistir la sesión del usuario
 * - Auto-refresh de tokens
 * - Detección automática de sesión
 * - Configuración para React Native
 */

// Procesamiento de credenciales - eliminación de espacios en blanco
const url = SUPABASE_URL?.trim();
const key = SUPABASE_ANON_KEY?.trim();

// Validación de credenciales - verificar que existan
if (!url || !key) {
  console.error('[Supabase] Missing credentials: please set SUPABASE_URL and SUPABASE_ANON_KEY in config.ts');
}

// Logging enmascarado para debugging - no expone credenciales completas
console.log(`[Supabase] Initializing with URL: ${url}`);
console.log(`[Supabase] Using anon key starts with: ${key?.slice(0, 5)}...`);

// Creación del cliente con credenciales procesadas
let supabase;
try {
  supabase = createClient(
    url || '',    // URL de Supabase
    key || '',    // Clave anónima
    {
      // Configuración de autenticación
      auth: {
        storage: AsyncStorage,           // Usar AsyncStorage para persistencia
        autoRefreshToken: true,          // Refrescar tokens automáticamente
        persistSession: true,            // Persistir sesión entre reinicios
        detectSessionInUrl: false,       // No detectar sesión en URL (React Native)
      },
      // Configuración global para React Native
      global: {
        fetch: globalThis.fetch,         // Usar fetch global
        WebSocket: globalThis.WebSocket, // Usar WebSocket global
      },
    }
  );

  // Logs de debug para inicialización exitosa
  console.log('[Supabase] Client initialized successfully');
} catch (error) {
  // Manejo de errores en la creación del cliente
  console.error('[Supabase] Error creating client', error);
}

// Exportación del cliente configurado
export default supabase;
// Fin del archivo supabaseClient.ts