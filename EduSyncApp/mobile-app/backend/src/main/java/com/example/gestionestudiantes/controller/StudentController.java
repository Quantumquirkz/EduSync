package com.example.gestionestudiantes.controller;

import com.example.gestionestudiantes.model.Student;
import com.example.gestionestudiantes.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Collections;
import java.util.List;

/**
 * EduSync - Controlador de Estudiantes
 * Endpoints REST para gestión de estudiantes
 * @author EduSync Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {
  
  private final StudentRepository repo;
  private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

  public StudentController(StudentRepository repo) {
    this.repo = repo;
  }

  /**
   * GET /api/students - Obtener todos los estudiantes
   */
  @GetMapping
  public ResponseEntity<List<Student>> all() {
    try {
      List<Student> students = repo.findAll();
      return ResponseEntity.ok(students);
    } catch (Exception e) {
      logger.error("Error fetching all students", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                          .body(Collections.emptyList());
    }
  }
}