/**
 * EduSync - Configuración
 * Credenciales y configuración de servicios externos
 * @author EduSync Team
 * @version 1.0.0
 */

/**
 * Supabase - Backend as a Service
 * Base de datos PostgreSQL + API REST + Autenticación
 */

// URL del proyecto Supabase
export const SUPABASE_URL = 'https://faollalzdyoigzfzggwy.supabase.co';

// Clave anónima para acceso público (con políticas RLS)
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb2xsYWx6ZHlvaWd6ZnpnZ3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDM3NDksImV4cCI6MjA2OTIxOTc0OX0.zgFbxqQ_NzX4DefxWL58jKEO7wPCUij1h_c2ttvdoIE';

/**
 * Groq - Chatbot AI
 * Servicio de IA para respuestas rápidas
 */

// Clave API para Groq (configurar en .env)
export const GROQ_API_KEY = '';

/**
 * Configuración de base de datos directa (referencia)
 * No se usa en la app móvil - solo documentación
 */
export const DB_CONFIG = {
  host: 'aws-0-us-east-2.pooler.supabase.com',    // Host PostgreSQL
  port: 6543,                                      // Puerto
  database: 'postgres',                            // Base de datos
  user: 'postgres.faollalzdyoigzfzggwy',          // Usuario
  pool_mode: 'transaction',                        // Modo pool
} as const;