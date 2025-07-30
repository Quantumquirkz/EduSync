/**
 * EduSync - Utilidades de Base de Datos
 * Operaciones CRUD para estudiantes
 * @author EduSync Team
 * @version 1.0.0
 */

import supabase from '../supabaseClient';

/**
 * Interfaz de estudiante
 */
export interface Student {
  id?: number;                    // ID único
  nombre: string;                 // Nombre
  apellido: string;               // Apellido
  cedula: string;                 // Cédula (único)
  edad: number;                   // Edad
  fecha_de_nacimiento: string;    // Fecha nacimiento
  genero: string;                 // Género
  herramienta_tecnica: string;    // Herramienta técnica
  pais_de_origen: string;         // País origen
  colegio_de_origen?: string | null;  // Colegio
  codigo_de_grupo: string;        // Código grupo
  universidad: string;            // Universidad
  facultad: string;               // Facultad
  materia_favorita?: string | null;   // Materia favorita
  horario: string;                // Horario
  año_carrera: string;            // Año carrera
  created_at?: string;            // Fecha creación
  updated_at?: string;            // Fecha actualización
}

/**
 * Operaciones CRUD para estudiantes
 */
export const studentOperations = {
  /**
   * Obtener todos los estudiantes
   */
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

  /**
   * Buscar por cédula
   */
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

  /**
   * Crear estudiante
   */
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

  /**
   * Actualizar estudiante
   */
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

  /**
   * Eliminar estudiante
   */
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

  /**
   * Buscar por nombre
   */
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

  /**
   * Filtrar por facultad
   */
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

  /**
   * Filtrar por grupo
   */
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

  /**
   * Estadísticas por género
   */
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

  /**
   * Estadísticas por facultad
   */
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