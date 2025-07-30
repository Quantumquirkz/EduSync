package com.example.gestionestudiantes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * EduSync - Aplicación Principal del Backend
 * 
 * Esta clase es el punto de entrada principal de la aplicación backend de EduSync.
 * Utiliza Spring Boot para crear una aplicación web con capacidades REST API
 * para la gestión de estudiantes universitarios.
 * 
 * Funcionalidades:
 * - Configuración automática de Spring Boot
 * - Escaneo automático de componentes (@Component, @Service, @Repository, @Controller)
 * - Configuración automática de base de datos
 * - Servidor web embebido (Tomcat por defecto)
 * 
 * Anotaciones utilizadas:
 * - @SpringBootApplication: Combina @Configuration, @EnableAutoConfiguration y @ComponentScan
 * 
 * @author EduSync Team
 * @version 1.0.0
 * @since 1.0.0
 */
@SpringBootApplication
public class GestionEstudiantesApplication {
  
  /**
   * Método principal que inicia la aplicación Spring Boot
   * 
   * Este método es el punto de entrada de la aplicación Java.
   * SpringApplication.run() inicia el contexto de Spring y
   * arranca el servidor web embebido.
   * 
   * @param args Argumentos de línea de comandos pasados al programa
   *             (no utilizados en esta aplicación)
   */
  public static void main(String[] args) {
    // Iniciar la aplicación Spring Boot
    SpringApplication.run(GestionEstudiantesApplication.class, args);
  }
}