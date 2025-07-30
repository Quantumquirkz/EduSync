package com.example.gestionestudiantes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * EduSync - Aplicación Principal Backend
 * Punto de entrada de la aplicación Spring Boot
 * @author EduSync Team
 * @version 1.0.0
 */
@SpringBootApplication
public class GestionEstudiantesApplication {
  
  /**
   * Método principal - Inicia la aplicación Spring Boot
   */
  public static void main(String[] args) {
    SpringApplication.run(GestionEstudiantesApplication.class, args);
  }
}