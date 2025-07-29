import supabase from '../supabaseClient';

/**
 * Student interface shared across the app.
 */
export interface Student {
  id?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  edad: number;
  fecha_de_nacimiento: string;
  genero: string;
  herramienta_tecnica: string;
  pais_de_origen: string;
  colegio_de_origen?: string | null;
  codigo_de_grupo: string;
  universidad: string;
  facultad: string;
  materia_favorita?: string | null;
  horario: string;
  año_carrera: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Reusable CRUD helpers for the `Estudiantes` table.
 */
export const studentOperations = {
  async getAll(): Promise<Student[]> {
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('[studentOperations] getAll error:', error);
      throw error;
    }
    return data || [];
  },

  async getByCedula(cedula: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .eq('cedula', cedula)
      .single();

    if (error) {
      console.error('[studentOperations] getByCedula error:', error);
      throw error;
    }
    return data;
  },

  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .insert([student])
      .select()
      .single();

    if (error) {
      console.error('[studentOperations] create error:', error);
      throw error;
    }
    return data;
  },

  async update(cedula: string, updates: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .update(updates)
      .eq('cedula', cedula)
      .select()
      .single();

    if (error) {
      console.error('[studentOperations] update error:', error);
      throw error;
    }
    return data;
  },

  async remove(cedula: string): Promise<void> {
    const { error } = await supabase
      .from('Estudiantes')
      .delete()
      .eq('cedula', cedula);

    if (error) {
      console.error('[studentOperations] remove error:', error);
      throw error;
    }
  },

  async searchByName(name: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .or(`nombre.ilike.%${name}%,apellido.ilike.%${name}%`);

    if (error) {
      console.error('[studentOperations] searchByName error:', error);
      throw error;
    }
    return data || [];
  },

  async getByFacultad(facultad: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .eq('facultad', facultad);

    if (error) {
      console.error('[studentOperations] getByFacultad error:', error);
      throw error;
    }
    return data || [];
  },

  async getByGrupo(codigoGrupo: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .eq('codigo_de_grupo', codigoGrupo);

    if (error) {
      console.error('[studentOperations] getByGrupo error:', error);
      throw error;
    }
    return data || [];
  },

  async getStatsByGender(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from<{ genero: string }>('Estudiantes')
      .select('genero');

    if (error) {
      console.error('[studentOperations] getStatsByGender error:', error);
      throw error;
    }

    return (data || []).reduce((acc: Record<string, number>, { genero }) => {
      acc[genero] = (acc[genero] || 0) + 1;
      return acc;
    }, {});
  },

  async getStatsByFacultad(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from<{ facultad: string }>('Estudiantes')
      .select('facultad');

    if (error) {
      console.error('[studentOperations] getStatsByFacultad error:', error);
      throw error;
    }

    return (data || []).reduce((acc: Record<string, number>, { facultad }) => {
      acc[facultad] = (acc[facultad] || 0) + 1;
      return acc;
    }, {});
  },
};