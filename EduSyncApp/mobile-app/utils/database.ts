/**
 * EduSync - Utilidades de Base de Datos
 * 
 * Este archivo contiene las interfaces y operaciones CRUD para la gestión
 * de estudiantes en la aplicación EduSync. Proporciona una capa de abstracción
 * para interactuar con la tabla 'Estudiantes' de Supabase.
 * 
 * Funcionalidades:
 * - Definición de la interfaz Student
 * - Operaciones CRUD completas (Create, Read, Update, Delete)
 * - Búsquedas y filtros avanzados
 * - Generación de estadísticas
 * - Manejo de errores consistente
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importación del cliente de Supabase para operaciones de base de datos
import supabase from '../supabaseClient';

/**
 * Interfaz que define la estructura de un estudiante en el sistema
 * 
 * Esta interfaz se utiliza en toda la aplicación para mantener consistencia
 * en la estructura de datos de los estudiantes. Los campos opcionales
 * permiten flexibilidad en la creación y actualización de registros.
 */
export interface Student {
  id?: number;                    // Identificador único (generado automáticamente)
  nombre: string;                 // Nombre del estudiante (obligatorio)
  apellido: string;               // Apellido del estudiante (obligatorio)
  cedula: string;                 // Número de cédula (identificador único, obligatorio)
  edad: number;                   // Edad del estudiante
  fecha_de_nacimiento: string;    // Fecha de nacimiento (formato: YYYY-MM-DD)
  genero: string;                 // Género del estudiante
  herramienta_tecnica: string;    // Herramienta técnica preferida
  pais_de_origen: string;         // País de origen del estudiante
  colegio_de_origen?: string | null;  // Colegio de procedencia (opcional)
  codigo_de_grupo: string;        // Código del grupo académico
  universidad: string;            // Universidad donde estudia
  facultad: string;               // Facultad de la universidad
  materia_favorita?: string | null;   // Materia favorita (opcional)
  horario: string;                // Horario de clases
  año_carrera: string;            // Año de la carrera
  created_at?: string;            // Fecha de creación del registro
  updated_at?: string;            // Fecha de última actualización
}

/**
 * Objeto que contiene todas las operaciones CRUD para la tabla 'Estudiantes'
 * 
 * Este objeto proporciona métodos reutilizables para:
 * - Obtener todos los estudiantes
 * - Buscar estudiantes por diferentes criterios
 * - Crear nuevos estudiantes
 * - Actualizar información existente
 * - Eliminar estudiantes
 * - Generar estadísticas
 */
export const studentOperations = {
  /**
   * Obtiene todos los estudiantes ordenados alfabéticamente por nombre
   * 
   * @returns Promise<Student[]> - Promesa que resuelve con un array de estudiantes
   * 
   * Ejemplo de uso:
   * const allStudents = await studentOperations.getAll();
   */
  async getAll(): Promise<Student[]> {
    // Consultar todos los estudiantes ordenados por nombre ascendente
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .order('nombre', { ascending: true });

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] getAll error:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * Busca un estudiante específico por su número de cédula
   * 
   * @param cedula - Número de cédula del estudiante a buscar
   * @returns Promise<Student | null> - Promesa que resuelve con el estudiante o null si no existe
   * 
   * Ejemplo de uso:
   * const student = await studentOperations.getByCedula('1234567890');
   */
  async getByCedula(cedula: string): Promise<Student | null> {
    // Buscar estudiante por cédula exacta
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .eq('cedula', cedula)
      .single(); // Obtener un solo registro

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] getByCedula error:', error);
      throw error;
    }
    return data;
  },

  /**
   * Crea un nuevo estudiante en la base de datos
   * 
   * @param student - Objeto con los datos del estudiante (sin el campo id)
   * @returns Promise<Student> - Promesa que resuelve con el estudiante creado
   * 
   * Ejemplo de uso:
   * const newStudent = await studentOperations.create({
   *   nombre: 'Juan',
   *   apellido: 'Pérez',
   *   cedula: '1234567890',
   *   // ... otros campos
   * });
   */
  async create(student: Omit<Student, 'id'>): Promise<Student> {
    // Insertar nuevo estudiante y obtener el registro creado
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .insert([student])
      .select()
      .single();

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] create error:', error);
      throw error;
    }
    return data;
  },

  /**
   * Actualiza la información de un estudiante existente
   * 
   * @param cedula - Cédula del estudiante a actualizar
   * @param updates - Objeto con los campos a actualizar
   * @returns Promise<Student> - Promesa que resuelve con el estudiante actualizado
   * 
   * Ejemplo de uso:
   * const updatedStudent = await studentOperations.update('1234567890', {
   *   edad: 21,
   *   materia_favorita: 'Matemáticas'
   * });
   */
  async update(cedula: string, updates: Partial<Student>): Promise<Student> {
    // Actualizar estudiante por cédula y obtener el registro actualizado
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .update(updates)
      .eq('cedula', cedula)
      .select()
      .single();

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] update error:', error);
      throw error;
    }
    return data;
  },

  /**
   * Elimina un estudiante de la base de datos
   * 
   * @param cedula - Cédula del estudiante a eliminar
   * @returns Promise<void> - Promesa que se resuelve cuando se completa la eliminación
   * 
   * Ejemplo de uso:
   * await studentOperations.remove('1234567890');
   */
  async remove(cedula: string): Promise<void> {
    // Eliminar estudiante por cédula
    const { error } = await supabase
      .from('Estudiantes')
      .delete()
      .eq('cedula', cedula);

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] remove error:', error);
      throw error;
    }
  },

  /**
   * Busca estudiantes por nombre o apellido (búsqueda parcial)
   * 
   * @param name - Nombre o apellido a buscar (búsqueda case-insensitive)
   * @returns Promise<Student[]> - Promesa que resuelve con array de estudiantes encontrados
   * 
   * Ejemplo de uso:
   * const results = await studentOperations.searchByName('Juan');
   */
  async searchByName(name: string): Promise<Student[]> {
    // Buscar por nombre o apellido usando ILIKE para búsqueda parcial
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .or(`nombre.ilike.%${name}%,apellido.ilike.%${name}%`);

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] searchByName error:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * Obtiene todos los estudiantes de una facultad específica
   * 
   * @param facultad - Nombre de la facultad a filtrar
   * @returns Promise<Student[]> - Promesa que resuelve con array de estudiantes de la facultad
   * 
   * Ejemplo de uso:
   * const engineeringStudents = await studentOperations.getByFacultad('Ingeniería');
   */
  async getByFacultad(facultad: string): Promise<Student[]> {
    // Filtrar estudiantes por facultad
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .eq('facultad', facultad);

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] getByFacultad error:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * Obtiene todos los estudiantes de un grupo específico
   * 
   * @param codigoGrupo - Código del grupo académico
   * @returns Promise<Student[]> - Promesa que resuelve con array de estudiantes del grupo
   * 
   * Ejemplo de uso:
   * const groupStudents = await studentOperations.getByGrupo('G-2024-01');
   */
  async getByGrupo(codigoGrupo: string): Promise<Student[]> {
    // Filtrar estudiantes por código de grupo
    const { data, error } = await supabase
      .from<Student>('Estudiantes')
      .select('*')
      .eq('codigo_de_grupo', codigoGrupo);

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] getByGrupo error:', error);
      throw error;
    }
    return data || [];
  },

  /**
   * Genera estadísticas de estudiantes por género
   * 
   * @returns Promise<Record<string, number>> - Promesa que resuelve con objeto de conteos por género
   * 
   * Ejemplo de uso:
   * const genderStats = await studentOperations.getStatsByGender();
   * // Resultado: { 'Masculino': 25, 'Femenino': 30 }
   */
  async getStatsByGender(): Promise<Record<string, number>> {
    // Obtener solo el campo género de todos los estudiantes
    const { data, error } = await supabase
      .from<{ genero: string }>('Estudiantes')
      .select('genero');

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] getStatsByGender error:', error);
      throw error;
    }

    // Calcular conteos por género usando reduce
    return (data || []).reduce((acc: Record<string, number>, { genero }) => {
      acc[genero] = (acc[genero] || 0) + 1;
      return acc;
    }, {});
  },

  /**
   * Genera estadísticas de estudiantes por facultad
   * 
   * @returns Promise<Record<string, number>> - Promesa que resuelve con objeto de conteos por facultad
   * 
   * Ejemplo de uso:
   * const facultyStats = await studentOperations.getStatsByFacultad();
   * // Resultado: { 'Ingeniería': 20, 'Medicina': 15, 'Derecho': 10 }
   */
  async getStatsByFacultad(): Promise<Record<string, number>> {
    // Obtener solo el campo facultad de todos los estudiantes
    const { data, error } = await supabase
      .from<{ facultad: string }>('Estudiantes')
      .select('facultad');

    // Manejo de errores - lanzar excepción si hay error
    if (error) {
      console.error('[studentOperations] getStatsByFacultad error:', error);
      throw error;
    }

    // Calcular conteos por facultad usando reduce
    return (data || []).reduce((acc: Record<string, number>, { facultad }) => {
      acc[facultad] = (acc[facultad] || 0) + 1;
      return acc;
    }, {});
  },
};