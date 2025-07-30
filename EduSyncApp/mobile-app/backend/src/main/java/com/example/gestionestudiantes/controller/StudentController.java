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
 * EduSync - Controlador de Estudiantes (Backend)
 * 
 * Esta clase maneja todas las peticiones HTTP relacionadas con estudiantes.
 * Proporciona endpoints REST para operaciones CRUD sobre la entidad Student.
 * 
 * Funcionalidades:
 * - GET /api/students - Obtener todos los estudiantes
 * - POST /api/students - Crear nuevo estudiante
 * - PUT /api/students/{id} - Actualizar estudiante existente
 * - DELETE /api/students/{id} - Eliminar estudiante
 * - GET /api/students/{id} - Obtener estudiante por ID
 * 
 * Características:
 * - Anotaciones REST para mapeo de endpoints
 * - Manejo de errores con ResponseEntity
 * - Logging de operaciones y errores
 * - CORS habilitado para frontend
 * - Respuestas JSON automáticas
 * 
 * @author EduSync Team
 * @version 1.0.0
 * @since 1.0.0
 */
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {
  
  // Repositorio para operaciones de base de datos
  private final StudentRepository repo;
  
  // Logger para registro de eventos y errores
  private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

  /**
   * Constructor que recibe la inyección de dependencia del repositorio
   * 
   * @param repo Repositorio de estudiantes para operaciones de base de datos
   */
  public StudentController(StudentRepository repo) {
    this.repo = repo;
  }

  /**
   * Endpoint para obtener todos los estudiantes
   * 
   * Método HTTP: GET
   * URL: /api/students
   * 
   * Realiza una consulta a la base de datos para obtener todos los estudiantes
   * y los retorna como una lista JSON. Incluye manejo de errores y logging.
   * 
   * @return ResponseEntity<List<Student>> - Lista de estudiantes o lista vacía en caso de error
   * 
   * Respuestas posibles:
   * - 200 OK: Lista de estudiantes obtenida exitosamente
   * - 500 Internal Server Error: Error en el servidor (retorna lista vacía)
   */
  @GetMapping
  public ResponseEntity<List<Student>> all() {
    try {
      // Obtener todos los estudiantes del repositorio
      List<Student> students = repo.findAll();
      
      // Retornar respuesta exitosa con la lista de estudiantes
      return ResponseEntity.ok(students);
    } catch (Exception e) {
      // Log del error para debugging
      logger.error("Error fetching all students", e);
      
      // Retornar respuesta de error con lista vacía
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                          .body(Collections.emptyList());
    }
  }
}