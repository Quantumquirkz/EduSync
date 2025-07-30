#!/bin/bash

echo "🧹 Limpiando archivos sensibles del repositorio..."

# Eliminar archivo .env del tracking de git
git rm --cached .env 2>/dev/null || echo "Archivo .env no encontrado en git"

# Eliminar archivo .env de EduSyncApp/mobile-app si existe
git rm --cached EduSyncApp/mobile-app/.env 2>/dev/null || echo "Archivo EduSyncApp/mobile-app/.env no encontrado en git"

# Agregar .gitignore a la raíz si no existe
if [ ! -f .gitignore ]; then
    echo "Creando .gitignore en la raíz..."
    cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.production
.env.development

# API Keys and Secrets
config.local.ts
secrets.json

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependencies
node_modules/

# Build outputs
dist/
build/
*.tsbuildinfo
EOF
fi

# Hacer commit de los cambios
git add .gitignore
git commit -m "Add root .gitignore and remove sensitive files from tracking"

echo "✅ Limpieza completada!"
echo "📝 Ahora puedes hacer push sin problemas:"
echo "   git push" 