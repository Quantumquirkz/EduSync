# 📁 Estructura del Proyecto EduSync

## 🏗️ Organización General

```
EduSync/
├── 📁 EduSyncApp/
│   └── 📁 mobile-app/           # Aplicación móvil principal (React Native + Expo)
│       ├── 📁 assets/           # Recursos estáticos (iconos, imágenes)
│       ├── 📁 screens/          # Pantallas de la aplicación
│       ├── 📁 hooks/            # Custom hooks de React
│       ├── 📁 utils/            # Utilidades y funciones auxiliares
│       ├── 📁 convex/           # Configuración de Convex (base de datos)
│       ├── 📁 backend/          # Código del backend
│       ├── 📄 App.tsx           # Componente principal de la aplicación
│       ├── 📄 package.json      # Dependencias del proyecto
│       ├── 📄 app.json          # Configuración de Expo
│       ├── 📄 tsconfig.json     # Configuración de TypeScript
│       └── 📄 SETUP.md          # Instrucciones de configuración
├── 📁 docs/                     # Documentación específica
│   ├── 📄 FRONTEND_README.md    # Documentación específica del frontend
│   ├── 📄 BACKEND_README.md     # Documentación específica del backend
│   ├── 📄 DATABASE_README.md    # Documentación de la base de datos
│   ├── 📄 HOSTING_README.md     # Documentación de despliegue
│   ├── 📄 PROJECT_STRUCTURE.md  # Documentación de estructura
│   └── 📄 CHANGELOG.md          # Registro de cambios
├── 📄 README.md                 # Documentación principal del proyecto
├── 📄 cleanup.sh                # Script de limpieza del proyecto
└── 📄 .gitignore                # Archivos ignorados por Git
```

## 🔄 Cambios Realizados

### ✅ Reorganización Completada

1. **Renombrado de carpeta principal**: `a0-project` → `mobile-app`
   - Nombre más descriptivo y profesional
   - Refleja mejor el contenido (aplicación móvil)

2. **Limpieza de estructura**:
   - Eliminadas carpetas vacías (`backend/`, `frontend/`, `database/`)
   - Estructura más limpia y enfocada

3. **Actualización de documentación**:
   - Todos los README actualizados con las nuevas rutas
   - Archivos de configuración actualizados
   - Scripts de limpieza actualizados

## 📱 Aplicación Móvil (`mobile-app/`)

### Tecnologías Principales
- **React Native** con **Expo SDK 52**
- **TypeScript** para tipado estático
- **React Navigation v7** para navegación
- **Supabase** para autenticación y base de datos
- **Convex** para operaciones en tiempo real

### Estructura Interna
```
mobile-app/
├── 📁 screens/          # Pantallas de la aplicación
│   ├── 📁 auth/        # Autenticación y login
│   ├── 📁 students/    # Gestión de estudiantes
│   └── 📁 dashboard/   # Panel principal
├── 📁 hooks/           # Custom hooks reutilizables
├── 📁 utils/           # Funciones auxiliares
├── 📁 convex/          # Configuración de Convex
├── 📁 backend/         # Código del servidor
├── 📁 assets/          # Recursos estáticos
└── 📄 Config files     # Archivos de configuración
```

## 🚀 Cómo Usar

### Desarrollo Local
```bash
# Navegar al proyecto
cd EduSyncApp/mobile-app

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npx expo start
```

### Configuración
1. Crear archivo `.env` en `EduSyncApp/mobile-app/`
2. Configurar variables de entorno (ver `SETUP.md`)
3. Configurar Supabase y Convex

## 📚 Documentación

- **README.md**: Visión general del proyecto (en la raíz)
- **docs/FRONTEND_README.md**: Detalles específicos del frontend
- **docs/BACKEND_README.md**: Configuración del backend
- **docs/DATABASE_README.md**: Estructura de la base de datos
- **docs/HOSTING_README.md**: Guía de despliegue
- **docs/PROJECT_STRUCTURE.md**: Documentación de estructura
- **docs/CHANGELOG.md**: Registro de cambios
- **EduSyncApp/mobile-app/SETUP.md**: Instrucciones de configuración inicial

## 🎯 Beneficios de la Nueva Estructura

1. **Claridad**: Nombres más descriptivos y organizados
2. **Mantenibilidad**: Estructura más fácil de navegar
3. **Escalabilidad**: Preparado para futuras expansiones
4. **Documentación**: Actualizada y consistente
5. **Limpieza**: Eliminación de carpetas innecesarias 