/**
 * EduSync - Configuración Local de Ejemplo
 * 
 * Este archivo sirve como plantilla para la configuración local de desarrollo.
 * Contiene variables de ejemplo que deben ser reemplazadas con valores reales
 * para el funcionamiento de la aplicación.
 * 
 * INSTRUCCIONES DE USO:
 * 1. Copia este archivo y renómbralo a 'config.local.ts'
 * 2. Reemplaza los valores de ejemplo con tus credenciales reales
 * 3. Asegúrate de que config.local.ts esté en .gitignore para no exponer credenciales
 * 
 * IMPORTANTE: Nunca subas credenciales reales al repositorio
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

/**
 * Configuración local para desarrollo
 * 
 * Esta configuración debe ser personalizada para cada desarrollador
 * y entorno de desarrollo. Los valores aquí son solo ejemplos.
 */
export const LOCAL_CONFIG = {
  // URL de tu proyecto Supabase
  // Encuentra esta URL en el dashboard de Supabase > Settings > API
  SUPABASE_URL: 'tu_supabase_url_aqui',
  
  // Clave anónima de Supabase
  // Esta clave permite acceso público a la base de datos (con políticas RLS)
  // Encuentra esta clave en el dashboard de Supabase > Settings > API
  SUPABASE_ANON_KEY: 'tu_supabase_anon_key_aqui',
  
  // Clave API de Groq para el chatbot
  // Obtén esta clave registrándote en https://console.groq.com/
  GROQ_API_KEY: 'tu_groq_api_key_aqui',
  
  // Configuración de conexión directa a la base de datos (opcional)
  // Solo se usa para desarrollo avanzado o herramientas de administración
  DB_CONFIG: {
    host: 'tu_db_host_aqui',      // Host del servidor de base de datos
    port: 6543,                   // Puerto de conexión (por defecto para Supabase)
    database: 'postgres',         // Nombre de la base de datos
    user: 'tu_db_user_aqui',      // Usuario de la base de datos
    pool_mode: 'transaction',     // Modo de pool de conexiones
  }
}; 