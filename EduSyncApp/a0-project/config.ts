// Supabase configuration - use your project's credentials
// IMPORTANTE: Configura estas variables en tu archivo .env
// Para React Native, necesitarás usar react-native-dotenv o similar
export const SUPABASE_URL = 'https://faollalzdyoigzfzggwy.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb2xsYWx6ZHlvaWd6ZnpnZ3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDM3NDksImV4cCI6MjA2OTIxOTc0OX0.zgFbxqQ_NzX4DefxWL58jKEO7wPCUij1h_c2ttvdoIE';

// API Key for Groq Chatbot
// IMPORTANTE: Configura tu GROQ_API_KEY en el archivo .env
// Para desarrollo, puedes usar la clave directamente aquí
export const GROQ_API_KEY = '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';

// Configuración de conexión directa a la base de datos (referencia; no se usa en la app móvil).
export const DB_CONFIG = {
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.faollalzdyoigzfzggwy',
  pool_mode: 'transaction',
} as const;