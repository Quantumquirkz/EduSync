/**
 * EduSync - Configuración de la Aplicación
 * 
 * Este archivo contiene todas las configuraciones necesarias para el funcionamiento
 * de la aplicación EduSync, incluyendo credenciales de servicios externos.
 * 
 * IMPORTANTE: Para producción, estas credenciales deben estar en variables de entorno
 * y no hardcodeadas en el código fuente.
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

/**
 * Configuración de Supabase
 * 
 * Supabase es la plataforma de backend-as-a-service que proporciona:
 * - Base de datos PostgreSQL
 * - Autenticación de usuarios
 * - API REST automática
 * - Almacenamiento de archivos
 */

// URL de la instancia de Supabase
// Esta URL identifica tu proyecto específico en Supabase
export const SUPABASE_URL = 'https://faollalzdyoigzfzggwy.supabase.co';

// Clave anónima de autenticación para Supabase
// Esta clave permite acceso público a la base de datos (con las políticas RLS configuradas)
// IMPORTANTE: En producción, esta clave debe estar en variables de entorno
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb2xsYWx6ZHlvaWd6ZnpnZ3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDM3NDksImV4cCI6MjA2OTIxOTc0OX0.zgFbxqQ_NzX4DefxWL58jKEO7wPCUij1h_c2ttvdoIE';

/**
 * Configuración del Chatbot Groq
 * 
 * Groq es un servicio de IA que proporciona respuestas rápidas y precisas
 * para el chatbot integrado en la aplicación.
 */

// Clave API para el servicio de chatbot Groq
// Esta clave permite acceder a los modelos de IA de Groq
// IMPORTANTE: Configura tu GROQ_API_KEY en el archivo .env local
// Para desarrollo, configura la clave en tu archivo .env local
export const GROQ_API_KEY = '';

/**
 * Configuración de conexión directa a la base de datos
 * 
 * NOTA: Esta configuración es solo de referencia y no se usa en la aplicación móvil.
 * Se incluye aquí para documentación y posibles usos futuros.
 * 
 * La aplicación móvil utiliza la API REST de Supabase en lugar de conexión directa.
 */
export const DB_CONFIG = {
  host: 'aws-0-us-east-2.pooler.supabase.com',    // Host del servidor de base de datos
  port: 6543,                                      // Puerto de conexión
  database: 'postgres',                            // Nombre de la base de datos
  user: 'postgres.faollalzdyoigzfzggwy',          // Usuario de la base de datos
  pool_mode: 'transaction',                        // Modo de pool de conexiones
} as const; // 'as const' hace que el objeto sea inmutable en TypeScript