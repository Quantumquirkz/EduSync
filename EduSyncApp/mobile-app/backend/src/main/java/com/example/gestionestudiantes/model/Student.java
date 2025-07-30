package com.example.gestionestudiantes.model;

import java.time.LocalDate;

/**
 * EduSync - Modelo de Estudiante
 * Record inmutable para datos de estudiantes
 * @author EduSync Team
 * @version 1.0.0
 */
public record Student(
    Integer id,                    // ID único
    String nombre,                 // Nombre
    String apellido,               // Apellido
    String cedula,                 // Cédula (único)
    Integer edad,                  // Edad
    LocalDate fechaNacimiento,     // Fecha nacimiento
    String genero,                 // Género
    String herramientaPreferida,   // Herramienta técnica
    String pais,                   // País origen
    String colegio,                // Colegio
    String codigoGrupo,            // Código grupo
    String universidad,            // Universidad
    String facultad,               // Facultad
    String materiaFavorita,        // Materia favorita
    String horario,                // Horario
    String añoCarrera              // Año carrera
) {}