/**
 * EduSync - Utilidades de Actividad
 * 
 * Este archivo contiene las funciones y tipos para el manejo de actividades
 * del sistema. Las actividades son registros de acciones realizadas por
 * los usuarios en la aplicación, como crear, actualizar o eliminar estudiantes.
 * 
 * Funcionalidades:
 * - Definición de tipos para actividades
 * - Registro de actividades en la base de datos
 * - Obtención de actividades recientes
 * - Logging de errores para debugging
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importación del cliente de Supabase para operaciones de base de datos
import supabase from '../supabaseClient';

/**
 * Interfaz que define la estructura de una actividad en el sistema
 * 
 * Las actividades se almacenan en la tabla 'Actividades' de Supabase
 * y se utilizan para mantener un historial de acciones realizadas.
 */
export interface Activity {
  id?: string;                                    // Identificador único (generado automáticamente)
  tipo: 'creado' | 'actualizado' | 'eliminado';  // Tipo de actividad realizada
  descripcion: string;                           // Descripción detallada de la actividad
  created_at?: string;                           // Fecha y hora de creación (timestamp)
}

/**
 * Objeto que contiene todas las operaciones relacionadas con actividades
 * 
 * Este objeto proporciona métodos para:
 * - Registrar nuevas actividades
 * - Obtener actividades recientes
 * - Manejo de errores en operaciones de base de datos
 */
export const activityOperations = {
  /**
   * Registra una nueva actividad en la base de datos
   * 
   * @param tipo - Tipo de actividad ('creado', 'actualizado', 'eliminado')
   * @param descripcion - Descripción detallada de la actividad realizada
   * @returns Promise<void> - Promesa que se resuelve cuando se completa el registro
   * 
   * Ejemplo de uso:
   * await activityOperations.log('creado', 'Estudiante Juan Pérez agregado al sistema');
   */
  async log(tipo: Activity['tipo'], descripcion: string): Promise<void> {
    // Insertar nueva actividad en la tabla 'Actividades'
    const { error } = await supabase.from<Activity>('Actividades').insert([{ tipo, descripcion }]);
    
    // Manejo de errores - log del error si ocurre
    if (error) {
      console.error('[activityOperations] log error:', error);
    }
  },

  /**
   * Obtiene las actividades más recientes del sistema
   * 
   * @param limit - Número máximo de actividades a obtener (por defecto: 10)
   * @returns Promise<Activity[]> - Promesa que resuelve con un array de actividades
   * 
   * Las actividades se ordenan por fecha de creación (más recientes primero)
   * y se limitan al número especificado.
   * 
   * Ejemplo de uso:
   * const recentActivities = await activityOperations.fetchRecent(5);
   */
  async fetchRecent(limit = 10): Promise<Activity[]> {
    // Consultar actividades ordenadas por fecha de creación descendente
    const { data, error } = await supabase
      .from<Activity>('Actividades')
      .select('*')                    // Seleccionar todos los campos
      .order('created_at', { ascending: false })  // Ordenar por fecha descendente
      .limit(limit);                   // Limitar número de resultados
    
    // Manejo de errores - retornar array vacío si hay error
    if (error) {
      console.error('[activityOperations] fetchRecent error:', error);
      return [];
    }
    
    // Retornar datos o array vacío si no hay datos
    return data || [];
  },
};