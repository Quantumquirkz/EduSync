# 🎓 EduSync - Sistema de Gestión Estudiantil

## 📋 Descripción General

**EduSync** es una aplicación móvil completa desarrollada con React Native y Expo que proporciona un sistema integral de gestión estudiantil. La aplicación permite a los administradores educativos gestionar información detallada de estudiantes, generar estadísticas, y mantener un seguimiento de actividades en tiempo real.

## 🏗️ Arquitectura del Sistema

### Frontend (Aplicación Móvil)
- **Framework**: React Native con Expo
- **Navegación**: React Navigation v7
- **Estado**: React Hooks y Context API
- **UI/UX**: Componentes nativos con tema personalizado púrpura
- **Iconografía**: Expo Vector Icons (Ionicons)
- **Notificaciones**: Sonner Native para toast notifications

### Backend
- **Framework**: Spring Boot 3.3.0
- **Lenguaje**: Java 17
- **Arquitectura**: REST API con controladores
- **Base de Datos**: PostgreSQL (a través de Supabase)
- **Dependencias**: Spring Web, Spring JDBC, PostgreSQL Driver

### Base de Datos
- **Proveedor**: Supabase (PostgreSQL en la nube)
- **Autenticación**: Supabase Auth con AsyncStorage
- **Operaciones**: CRUD completo con operaciones personalizadas
- **Seguridad**: Row Level Security (RLS) habilitado

## 📱 Funcionalidades Principales

### 1. Gestión de Estudiantes
- **Crear**: Añadir nuevos estudiantes con información completa
- **Leer**: Visualizar lista de estudiantes con búsqueda y filtros
- **Actualizar**: Modificar información de estudiantes existentes
- **Eliminar**: Remover estudiantes del sistema
- **Búsqueda**: Búsqueda por nombre, cédula, facultad o grupo

### 2. Información del Estudiante
Cada estudiante incluye los siguientes campos:
- **Datos Personales**: Nombre, apellido, cédula, edad, fecha de nacimiento, género
- **Información Académica**: Universidad, facultad, materia favorita, año de carrera
- **Detalles Educativos**: Colegio de origen, código de grupo, horario
- **Preferencias**: Herramienta técnica preferida, país de origen

### 3. Estadísticas y Análisis
- **Distribución por Género**: Gráficos de distribución de estudiantes por género
- **Distribución por Facultad**: Análisis de estudiantes por facultad
- **Actividad Reciente**: Seguimiento de acciones realizadas en el sistema
- **Métricas Generales**: Resumen de totales y promedios

### 4. Sistema de Actividades
- **Logging Automático**: Registro automático de todas las operaciones CRUD
- **Historial**: Visualización de actividades recientes
- **Tipos de Actividad**: Creado, actualizado, eliminado

### 5. Chatbot Integrado
- **Proveedor**: Groq API
- **Funcionalidad**: Asistente inteligente para consultas sobre estudiantes
- **Integración**: Acceso directo desde la aplicación

## 🗂️ Estructura del Proyecto

```
EduSyncApp/
├── a0-project/                    # Proyecto principal
│   ├── assets/                    # Recursos estáticos
│   │   ├── icon.png              # Icono de la aplicación
│   │   ├── splash-icon.png       # Icono de splash screen
│   │   ├── adaptive-icon.png     # Icono adaptativo
│   │   └── favicon.png           # Favicon
│   │
│   ├── screens/                   # Pantallas de la aplicación
│   │   ├── auth/                 # Autenticación
│   │   │   ├── LoginScreen.tsx   # Pantalla de login
│   │   │   └── SignUpScreen.tsx  # Pantalla de registro
│   │   ├── WelcomeScreen.tsx     # Pantalla de bienvenida
│   │   ├── HomeScreen.tsx        # Pantalla principal
│   │   ├── StudentsListScreen.tsx # Lista de estudiantes
│   │   ├── StudentDetailScreen.tsx # Detalle de estudiante
│   │   ├── NewStudentScreen.tsx  # Crear nuevo estudiante
│   │   ├── StatisticsScreen.tsx  # Estadísticas
│   │   ├── ProfileScreen.tsx     # Perfil de usuario
│   │   ├── SettingsScreen.tsx    # Configuraciones
│   │   ├── ChatbotScreen.tsx     # Chatbot
│   │   └── PresentationScreen.tsx # Presentación del proyecto
│   │
│   ├── hooks/                     # Custom hooks
│   │   └── useSupabase.ts        # Hook para Supabase
│   │
│   ├── utils/                     # Utilidades
│   │   ├── database.ts           # Operaciones de base de datos
│   │   └── activity.ts           # Gestión de actividades
│   │
│   ├── backend/                   # Backend Spring Boot
│   │   ├── src/main/java/com/example/gestionestudiantes/
│   │   │   ├── controller/       # Controladores REST
│   │   │   │   └── StudentController.java
│   │   │   ├── model/           # Modelos de datos
│   │   │   │   └── Student.java
│   │   │   ├── repository/      # Repositorios de datos
│   │   │   │   └── StudentRepository.java
│   │   │   └── GestionEstudiantesApplication.java
│   │   └── pom.xml              # Configuración Maven
│   │
│   ├── convex/                   # Convex (no utilizado actualmente)
│   │   └── _generated/
│   │
│   ├── App.tsx                   # Componente principal
│   ├── config.ts                 # Configuración de APIs
│   ├── supabaseClient.ts         # Cliente de Supabase
│   ├── package.json              # Dependencias de Node.js
│   ├── tsconfig.json            # Configuración TypeScript
│   └── app.json                 # Configuración de Expo
```

## 🔧 Configuración y Tecnologías

### Dependencias Principales (Frontend)
```json
{
  "@supabase/supabase-js": "2.53.0",      // Cliente de Supabase
  "@react-navigation/native": "7.1.16",   // Navegación
  "@react-navigation/native-stack": "7.3.23",
  "@react-navigation/bottom-tabs": "7.4.4",
  "expo": "^52.0.46",                     // Framework Expo
  "react-native": "0.76.9",               // React Native
  "react-native-gesture-handler": "^2.16.1",
  "react-native-reanimated": "^3.10.1",
  "sonner-native": "0.21.0"               // Notificaciones
}
```

### Dependencias del Backend (Java)
```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
  </dependency>
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
  </dependency>
</dependencies>
```

## 🗄️ Base de Datos

### Tabla Principal: `Estudiantes`
```sql
CREATE TABLE Estudiantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  edad INTEGER NOT NULL,
  fecha_de_nacimiento DATE NOT NULL,
  genero VARCHAR(10) NOT NULL,
  herramienta_tecnica VARCHAR(255),
  pais_de_origen VARCHAR(100),
  colegio_de_origen VARCHAR(255),
  codigo_de_grupo VARCHAR(50) NOT NULL,
  universidad VARCHAR(255) NOT NULL,
  facultad VARCHAR(255) NOT NULL,
  materia_favorita VARCHAR(255),
  horario VARCHAR(100) NOT NULL,
  año_carrera VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla de Actividades: `Actividades`
```sql
CREATE TABLE Actividades (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL, -- 'creado', 'actualizado', 'eliminado'
  descripcion TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Configuración de Seguridad

### Supabase Configuration
```typescript
export const SUPABASE_URL = 'https://faollalzdyoigzfzggwy.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
export const GROQ_API_KEY = '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';
```

### Características de Seguridad
- **Autenticación**: Supabase Auth con persistencia en AsyncStorage
- **Autorización**: Row Level Security (RLS) en PostgreSQL
- **Validación**: Validación de datos en frontend y backend
- **Logging**: Registro de todas las operaciones para auditoría

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Java 17+
- Expo CLI
- Android Studio (para desarrollo Android)
- Xcode (para desarrollo iOS, solo macOS)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd EduSyncApp/a0-project
   ```

2. **Instalar dependencias del frontend**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear archivo `.env` basado en `config.ts`
   - Configurar `SUPABASE_URL` y `SUPABASE_ANON_KEY`
   - Configurar `GROQ_API_KEY` para el chatbot

4. **Configurar el backend**
   ```bash
   cd backend
   mvn clean install
   ```

5. **Ejecutar la aplicación**
   ```bash
   # Frontend
   npm start
   
   # Backend (en otra terminal)
   cd backend
   mvn spring-boot:run
   ```

## 📱 Características de la UI/UX

### Tema Personalizado
- **Colores Principales**: Púrpura (#9C27B0, #4A148C)
- **Fondo**: Negro (#000000)
- **Texto**: Blanco (#ffffff)
- **Bordes**: Gris oscuro (#333333)

### Navegación
- **Stack Navigation**: Navegación entre pantallas principales
- **Bottom Tabs**: Navegación rápida entre secciones
- **Animaciones**: Transiciones suaves y animaciones de entrada

### Componentes Reutilizables
- **Cards**: Para mostrar información de estudiantes
- **Buttons**: Botones personalizados con estados
- **Forms**: Formularios con validación
- **Charts**: Gráficos para estadísticas

## 🔄 Flujo de Datos

### Frontend → Backend
1. **Operaciones CRUD**: Las operaciones se realizan directamente a Supabase
2. **Validación**: Validación en frontend antes de enviar datos
3. **Manejo de Errores**: Toast notifications para errores
4. **Caché**: AsyncStorage para persistencia de sesión

### Backend → Base de Datos
1. **JDBC Template**: Conexión directa a PostgreSQL
2. **Queries Optimizadas**: Consultas SQL optimizadas
3. **Transacciones**: Manejo de transacciones para operaciones críticas
4. **Logging**: Registro de todas las operaciones

## 📊 Funcionalidades Avanzadas

### Sistema de Búsqueda
- Búsqueda por nombre (nombre y apellido)
- Filtros por facultad y grupo
- Búsqueda por cédula (búsqueda exacta)

### Estadísticas en Tiempo Real
- Conteo de estudiantes por género
- Distribución por facultad
- Gráficos interactivos
- Exportación de datos

### Sistema de Actividades
- Logging automático de todas las operaciones
- Historial de actividades recientes
- Filtros por tipo de actividad
- Timestamps precisos

## 🛠️ Desarrollo y Mantenimiento

### Scripts Disponibles
```json
{
  "start": "npx expo start",
  "android": "npx expo run:android",
  "ios": "npx expo run:ios",
  "web": "npx expo start --web"
}
```

### Estructura de Código
- **TypeScript**: Tipado estático para mejor mantenibilidad
- **ESLint**: Linting para consistencia de código
- **Prettier**: Formateo automático de código
- **Git Hooks**: Validaciones antes de commit

### Testing
- **Unit Tests**: Tests para utilidades y hooks
- **Integration Tests**: Tests para operaciones de base de datos
- **E2E Tests**: Tests de flujos completos

## 🔮 Roadmap y Mejoras Futuras

### Funcionalidades Planificadas
- [ ] Sistema de notificaciones push
- [ ] Exportación a PDF/Excel
- [ ] Dashboard avanzado con más métricas
- [ ] Integración con sistemas académicos externos
- [ ] Modo offline con sincronización
- [ ] Multiidioma (español/inglés)

### Mejoras Técnicas
- [ ] Migración a React Query para mejor gestión de estado
- [ ] Implementación de PWA
- [ ] Optimización de rendimiento
- [ ] Mejoras en la accesibilidad
- [ ] Tests automatizados completos

## 📞 Soporte y Contacto

Para soporte técnico o consultas sobre el proyecto:
- **Email**: [tu-email@ejemplo.com]
- **GitHub Issues**: [link-al-repositorio/issues]
- **Documentación**: [link-a-documentación]

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la gestión educativa moderna**