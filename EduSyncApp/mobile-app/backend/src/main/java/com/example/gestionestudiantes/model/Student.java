package com.example.gestionestudiantes.model;

import java.time.LocalDate;

public record Student(
    Integer id,
    String nombre,
    String apellido,
    String cedula,
    Integer edad,
    LocalDate fechaNacimiento,
    String genero,
    String herramientaPreferida,
    String pais,
    String colegio,
    String codigoGrupo,
    String universidad,
    String facultad,
    String materiaFavorita,
    String horario,
    String añoCarrera
) {}