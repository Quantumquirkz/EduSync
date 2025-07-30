/**
 * EduSync - Utilidades de Actividad
 * Registro y consulta de actividades del sistema
 * @author EduSync Team
 * @version 1.0.0
 */

import supabase from '../supabaseClient';

/**
 * Interfaz de actividad del sistema
 */
export interface Activity {
  id?: string;                                    // ID único
  tipo: 'creado' | 'actualizado' | 'eliminado';  // Tipo de actividad
  descripcion: string;                           // Descripción
  created_at?: string;                           // Fecha de creación
}

/**
 * Operaciones de actividades
 */
export const activityOperations = {
  /**
   * Registrar nueva actividad
   */
  async log(tipo: Activity['tipo'], descripcion: string): Promise<void> {
    const { error } = await supabase.from<Activity>('Actividades').insert([{ tipo, descripcion }]);
    if (error) {
      console.error('[activityOperations] log error:', error);
    }
  },

  /**
   * Obtener actividades recientes
   */
  async fetchRecent(limit = 10): Promise<Activity[]> {
    const { data, error } = await supabase
      .from<Activity>('Actividades')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('[activityOperations] fetchRecent error:', error);
      return [];
    }
    return data || [];
  },
};