# 🌐 Hosting y Despliegue - EduSync

## 📋 Descripción General

EduSync utiliza una arquitectura distribuida con diferentes servicios hosteados en la nube. Cada componente está optimizado para su función específica y utiliza las mejores prácticas de la industria para garantizar escalabilidad, seguridad y rendimiento.

## 🏗️ Arquitectura de Hosting

### **Diagrama de Arquitectura**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   (React Native)│    │   (Spring Boot) │    │   Datos         │
│                 │    │                 │    │   (Supabase)    │
│ • Expo          │    │ • Java 17       │    │ • PostgreSQL    │
│ • React Native  │    │ • Spring Boot   │    │ • API REST      │
│ • TypeScript    │    │ • Maven         │    │ • Auth          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Chatbot       │
                    │   (Groq API)    │
                    │                 │
                    │ • Groq Cloud    │
                    │ • LLM           │
                    │ • API REST      │
                    └─────────────────┘
```

## 🗄️ Base de Datos - Supabase

### **Proveedor**: Supabase
- **URL**: `https://faollalzdyoigzfzggwy.supabase.co`
- **Región**: AWS US East (N. Virginia)
- **Plan**: Gratuito (hasta 500MB)
- **Tipo**: PostgreSQL en la nube

### **Características del Hosting**
- **Infraestructura**: AWS (Amazon Web Services)
- **Región**: us-east-1 (N. Virginia)
- **Almacenamiento**: 500MB incluidos
- **Ancho de banda**: 2GB/mes incluidos
- **Backup**: Automático diario
- **Uptime**: 99.9% garantizado

### **Configuración de Conexión**
```typescript
// Configuración de Supabase
export const SUPABASE_URL = 'https://faollalzdyoigzfzggwy.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Configuración de conexión directa
export const DB_CONFIG = {
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.faollalzdyoigzfzggwy',
  pool_mode: 'transaction',
};
```

### **Ventajas de Supabase**
- ✅ **PostgreSQL completo**: Todas las características de PostgreSQL
- ✅ **API automática**: REST y GraphQL automáticos
- ✅ **Autenticación**: Sistema de auth integrado
- ✅ **Tiempo real**: Suscripciones WebSocket
- ✅ **Escalabilidad**: Crece automáticamente
- ✅ **Gratuito**: Plan gratuito generoso
- ✅ **Dashboard**: Interfaz web para gestión

## 🤖 Chatbot - Groq API

### **Proveedor**: Groq
- **URL**: `https://api.groq.com`
- **Tipo**: API de Language Model
- **Modelo**: Llama 3.1 8B
- **Región**: Global (múltiples regiones)

### **Configuración**
```typescript
// Configuración de Groq
export const GROQ_API_KEY = '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';

// Ejemplo de uso
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: 'Hola' }],
  }),
});
```

### **Características del Hosting**
- **Infraestructura**: Propietaria de Groq
- **Latencia**: < 100ms
- **Disponibilidad**: 99.9%
- **Rate Limiting**: 1000 requests/min
- **Modelos**: Múltiples modelos disponibles

## 📱 Frontend - React Native con Expo

### **Desarrollo Local**
- **Framework**: React Native con Expo
- **Plataforma**: Cross-platform (iOS/Android)
- **Hosting**: Desarrollo local + Expo Go

### **Despliegue de Producción**

#### **Opción 1: Expo Application Services (EAS)**
```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar EAS
eas build:configure

# Construir para Android
eas build --platform android

# Construir para iOS
eas build --platform ios
```

#### **Opción 2: Expo Classic Build**
```bash
# Construir para Android
expo build:android

# Construir para iOS
expo build:ios
```

### **Configuración de app.json**
```json
{
  "expo": {
    "name": "EduSync",
    "slug": "edusync",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.edusync.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.edusync.app"
    }
  }
}
```

## ⚙️ Backend - Spring Boot

### **Desarrollo Local**
- **Framework**: Spring Boot 3.3.0
- **Lenguaje**: Java 17
- **Puerto**: 8080
- **Hosting**: Localhost

### **Despliegue de Producción**

#### **Opción 1: Heroku**
```bash
# Crear aplicación en Heroku
heroku create edusync-backend

# Configurar variables de entorno
heroku config:set DB_PASSWORD=tu_password
heroku config:set JAVA_OPTS="-Xmx512m -Xms256m"

# Desplegar
git push heroku main
```

#### **Opción 2: Railway**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Iniciar sesión
railway login

# Desplegar
railway up
```

#### **Opción 3: AWS Elastic Beanstalk**
```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar aplicación
eb init

# Crear entorno
eb create edusync-backend

# Desplegar
eb deploy
```

### **Configuración de Producción**
```properties
# application-prod.properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

server.port=${PORT:8080}
spring.profiles.active=prod

# Configuración de seguridad
spring.security.require-ssl=true
server.ssl.enabled=true
```

## 🔧 Configuración de Variables de Entorno

### **Desarrollo Local**
```bash
# .env
SUPABASE_URL=https://faollalzdyoigzfzggwy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GROQ_API_KEY=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
```

### **Producción (Heroku)**
```bash
# Configurar variables en Heroku
heroku config:set SUPABASE_URL=https://faollalzdyoigzfzggwy.supabase.co
heroku config:set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
heroku config:set GROQ_API_KEY=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
```

## 🚀 Proceso de Despliegue

### **1. Preparación**
```bash
# Verificar configuración
npm run lint
npm run test

# Construir aplicación
npm run build
```

### **2. Despliegue de Base de Datos**
```bash
# Las tablas ya están creadas en Supabase
# Verificar conexión
supabase status
```

### **3. Despliegue del Backend**
```bash
# Navegar al directorio del backend
cd EduSyncApp/a0-project/backend

# Construir JAR
mvn clean package

# Desplegar en Heroku
heroku deploy:jar target/gestion-estudiantes-1.0.0.jar
```

### **4. Despliegue del Frontend**
```bash
# Construir para producción
eas build --platform all

# O usar Expo Classic
expo build:android
expo build:ios
```

## 📊 Monitoreo y Logs

### **Supabase Dashboard**
- **URL**: https://supabase.com/dashboard/project/faollalzdyoigzfzggwy
- **Métricas**: Uso de almacenamiento, ancho de banda, consultas
- **Logs**: Logs de todas las operaciones
- **SQL Editor**: Editor SQL integrado

### **Heroku Logs**
```bash
# Ver logs en tiempo real
heroku logs --tail

# Ver logs específicos
heroku logs --source app
```

### **Expo Analytics**
- **URL**: https://expo.dev/accounts/[username]/projects/edusync
- **Métricas**: Instalaciones, sesiones, errores
- **Crash Reports**: Reportes de errores automáticos

## 🔐 Seguridad

### **SSL/TLS**
- **Supabase**: HTTPS automático
- **Heroku**: SSL automático
- **Groq**: HTTPS obligatorio

### **Autenticación**
- **Supabase Auth**: Sistema de autenticación integrado
- **JWT Tokens**: Tokens seguros para sesiones
- **Row Level Security**: Seguridad a nivel de fila

### **Variables de Entorno**
- **Desarrollo**: Archivo .env (no en repositorio)
- **Producción**: Variables de entorno del servidor
- **Rotación**: Rotación regular de claves API

## 📈 Escalabilidad

### **Supabase**
- **Plan gratuito**: 500MB, 2GB/mes
- **Plan Pro**: 8GB, 250GB/mes
- **Plan Team**: 100GB, 2TB/mes
- **Auto-scaling**: Automático

### **Heroku**
- **Plan Hobby**: $7/mes
- **Plan Standard**: $25/mes
- **Plan Performance**: $250/mes
- **Auto-scaling**: Configurable

### **Groq**
- **Pay-per-use**: $0.05/1M tokens
- **Rate Limiting**: 1000 requests/min
- **Auto-scaling**: Automático

## 🔄 CI/CD Pipeline

### **GitHub Actions**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "edusync-backend"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Expo
        run: |
          npm install -g @expo/eas-cli
          eas build --platform all --non-interactive
```

## 💰 Costos Estimados

### **Plan Gratuito (Actual)**
- **Supabase**: $0/mes (500MB, 2GB/mes)
- **Heroku**: $0/mes (Hobby Dyno)
- **Groq**: $0/mes (primeros 1000 requests)
- **Expo**: $0/mes (builds básicos)

### **Plan de Producción**
- **Supabase Pro**: $25/mes (8GB, 250GB/mes)
- **Heroku Standard**: $25/mes (Standard-1X)
- **Groq**: ~$10/mes (200K requests)
- **Expo Pro**: $99/mes (builds ilimitados)

**Total estimado**: $159/mes para producción completa

## 🔮 Mejoras de Hosting

### **Optimizaciones Planificadas**
- [ ] CDN para assets estáticos
- [ ] Cache con Redis
- [ ] Load balancing
- [ ] Auto-scaling avanzado
- [ ] Monitoreo con Prometheus
- [ ] Backup automático

### **Migración de Plataforma**
- [ ] AWS ECS para backend
- [ ] CloudFront para CDN
- [ ] RDS para base de datos
- [ ] Lambda para funciones serverless

---

**🔗 Enlaces Útiles:**
- [Supabase Dashboard](https://supabase.com/dashboard/project/faollalzdyoigzfzggwy)
- [Heroku Dashboard](https://dashboard.heroku.com/apps/edusync-backend)
- [Expo Dashboard](https://expo.dev/accounts/quantumquirkz/projects/edusync)
- [Groq Console](https://console.groq.com/) 