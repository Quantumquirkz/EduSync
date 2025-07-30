// Configuración local de ejemplo
// Copia este archivo y renómbralo a config.local.ts
// Luego agrega tus claves reales

export const LOCAL_CONFIG = {
  SUPABASE_URL: 'tu_supabase_url_aqui',
  SUPABASE_ANON_KEY: 'tu_supabase_anon_key_aqui',
  GROQ_API_KEY: 'tu_groq_api_key_aqui',
  DB_CONFIG: {
    host: 'tu_db_host_aqui',
    port: 6543,
    database: 'postgres',
    user: 'tu_db_user_aqui',
    pool_mode: 'transaction',
  }
}; 