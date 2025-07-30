package com.example.gestionestudiantes.repository;

import com.example.gestionestudiantes.model.Student;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * EduSync - Repositorio de Estudiantes (Backend)
 * 
 * Esta clase maneja todas las operaciones de base de datos relacionadas
 * con la entidad Student. Utiliza Spring JDBC para realizar consultas
 * SQL directas a la base de datos PostgreSQL (Supabase).
 * 
 * Funcionalidades:
 * - Consulta de todos los estudiantes
 * - Operaciones CRUD (Create, Read, Update, Delete)
 * - Mapeo de resultados de base de datos a objetos Java
 * - Manejo de transacciones de base de datos
 * 
 * Características:
 * - Utiliza JdbcTemplate para operaciones de base de datos
 * - Mapeo manual de ResultSet a objetos Student
 * - Consultas SQL optimizadas para PostgreSQL
 * - Manejo de tipos de datos específicos (LocalDate, etc.)
 * 
 * @author EduSync Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Repository
public class StudentRepository {
  
  // Template JDBC para operaciones de base de datos
  private final JdbcTemplate jdbc;

  /**
   * Constructor que recibe la inyección de dependencia de JdbcTemplate
   * 
   * @param jdbc Template JDBC configurado por Spring Boot
   */
  public StudentRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  /**
   * Obtiene todos los estudiantes de la base de datos
   * 
   * Realiza una consulta SQL para obtener todos los registros
   * de la tabla 'estudiantes' y los mapea a objetos Student.
   * 
   * @return Lista de todos los estudiantes en la base de datos
   * 
   * SQL ejecutado:
   * SELECT id, nombre, apellido, cedula, edad, fecha_nacimiento, genero, 
   *        herramienta_preferida, pais, colegio, codigo_grupo, universidad, 
   *        facultad, materia_favorita, horario, año_carrera
   * FROM estudiantes
   */
  public List<Student> findAll() {
    // Consulta SQL para obtener todos los estudiantes
    String sql = """
      SELECT id, nombre, apellido, cedula, edad, fecha_nacimiento, genero, herramienta_preferida,
             pais, colegio, codigo_grupo, universidad, facultad, materia_favorita,
             horario, año_carrera
        FROM estudiantes
    """;
    
    // Ejecutar consulta y mapear resultados a objetos Student
    return jdbc.query(sql, (rs, row) -> new Student(
        rs.getInt("id"),                                    // ID del estudiante
        rs.getString("nombre"),                             // Nombre
        rs.getString("apellido"),                           // Apellido
        rs.getString("cedula"),                             // Cédula
        rs.getInt("edad"),                                  // Edad
        rs.getObject("fecha_nacimiento", java.time.LocalDate.class), // Fecha de nacimiento
        rs.getString("genero"),                             // Género
        rs.getString("herramienta_preferida"),              // Herramienta preferida
        rs.getString("pais"),                               // País
        rs.getString("colegio"),                            // Colegio
        rs.getString("codigo_grupo"),                       // Código de grupo
        rs.getString("universidad"),                        // Universidad
        rs.getString("facultad"),                           // Facultad
        rs.getString("materia_favorita"),                   // Materia favorita
        rs.getString("horario"),                            // Horario
        rs.getString("año_carrera")                         // Año de carrera
    ));
  }
}