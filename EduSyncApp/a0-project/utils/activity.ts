import supabase from '../supabaseClient';

export interface Activity {
  id?: string;
  tipo: 'creado' | 'actualizado' | 'eliminado';
  descripcion: string;
  created_at?: string;
}

export const activityOperations = {
  async log(tipo: Activity['tipo'], descripcion: string): Promise<void> {
    const { error } = await supabase.from<Activity>('Actividades').insert([{ tipo, descripcion }]);
    if (error) {
      console.error('[activityOperations] log error:', error);
    }
  },

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