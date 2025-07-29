package com.example.gestionestudiantes.repository;

import com.example.gestionestudiantes.model.Student;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StudentRepository {
  private final JdbcTemplate jdbc;

  public StudentRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public List<Student> findAll() {
    String sql = """
      SELECT id, nombre, apellido, cedula, edad, fecha_nacimiento, genero, herramienta_preferida,
             pais, colegio, codigo_grupo, universidad, facultad, materia_favorita,
             horario, año_carrera
        FROM estudiantes
    """;
    return jdbc.query(sql, (rs, row) -> new Student(
        rs.getInt("id"),
        rs.getString("nombre"),
        rs.getString("apellido"),
        rs.getString("cedula"),
        rs.getInt("edad"),
        rs.getObject("fecha_nacimiento", java.time.LocalDate.class),
        rs.getString("genero"),
        rs.getString("herramienta_preferida"),
        rs.getString("pais"),
        rs.getString("colegio"),
        rs.getString("codigo_grupo"),
        rs.getString("universidad"),
        rs.getString("facultad"),
        rs.getString("materia_favorita"),
        rs.getString("horario"),
        rs.getString("año_carrera")
    ));
  }
}