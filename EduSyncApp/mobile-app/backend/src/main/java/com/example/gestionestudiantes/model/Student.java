package com.example.gestionestudiantes.model;

import java.time.LocalDate;

/**
 * EduSync - Modelo de Estudiante (Backend)
 * 
 * Esta clase representa la entidad Estudiante en el sistema EduSync.
 * Utiliza un record de Java 17 para crear una clase inmutable que
 * representa los datos de un estudiante universitario.
 * 
 * Características:
 * - Inmutable: Los datos no pueden ser modificados después de la creación
 * - Automáticamente genera getters, equals(), hashCode() y toString()
 * - Compatible con serialización JSON para APIs REST
 * - Mapeo directo con la tabla 'Estudiantes' de la base de datos
 * 
 * Campos del modelo:
 * - id: Identificador único del estudiante (autogenerado)
 * - nombre: Nombre del estudiante
 * - apellido: Apellido del estudiante
 * - cedula: Número de cédula (identificador único)
 * - edad: Edad del estudiante
 * - fechaNacimiento: Fecha de nacimiento
 * - genero: Género del estudiante
 * - herramientaPreferida: Herramienta técnica preferida
 * - pais: País de origen
 * - colegio: Colegio de procedencia
 * - codigoGrupo: Código del grupo académico
 * - universidad: Universidad donde estudia
 * - facultad: Facultad de la universidad
 * - materiaFavorita: Materia favorita
 * - horario: Horario de clases
 * - añoCarrera: Año de la carrera
 * 
 * @author EduSync Team
 * @version 1.0.0
 * @since 1.0.0
 */
public record Student(
    Integer id,                    // Identificador único (autogenerado)
    String nombre,                 // Nombre del estudiante
    String apellido,               // Apellido del estudiante
    String cedula,                 // Número de cédula (identificador único)
    Integer edad,                  // Edad del estudiante
    LocalDate fechaNacimiento,     // Fecha de nacimiento
    String genero,                 // Género del estudiante
    String herramientaPreferida,   // Herramienta técnica preferida
    String pais,                   // País de origen
    String colegio,                // Colegio de procedencia
    String codigoGrupo,            // Código del grupo académico
    String universidad,            // Universidad donde estudia
    String facultad,               // Facultad de la universidad
    String materiaFavorita,        // Materia favorita
    String horario,                // Horario de clases
    String añoCarrera              // Año de la carrera
) {}