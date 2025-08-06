#!/bin/bash

# Script para pushear a GitHub
# Uso: ./scripts/push-to-github.sh <github-url>

if [ $# -eq 0 ]; then
    echo "❌ Error: Debes proporcionar la URL del repositorio de GitHub"
    echo "Uso: ./scripts/push-to-github.sh https://github.com/tu-usuario/mi-plantilla-web.git"
    exit 1
fi

GITHUB_URL=$1

echo "🚀 Configurando repositorio para GitHub..."
echo "📦 URL: $GITHUB_URL"

# Verificar si git está inicializado
if [ ! -d ".git" ]; then
    echo "❌ Error: No es un repositorio git"
    exit 1
fi

# Verificar si hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Hay cambios sin commitear. Haciendo commit..."
    git add .
    git commit -m "feat: Portfolio website with Supabase integration and admin panel

- Added Supabase authentication
- Created admin panel with dashboard
- Implemented photography and projects management
- Added user profile management
- Fixed authentication redirect loops
- Integrated real-time data from Supabase"
fi

# Configurar remoto
echo "🔧 Configurando remoto..."
git remote add origin "$GITHUB_URL" 2>/dev/null || git remote set-url origin "$GITHUB_URL"

# Configurar rama main
echo "🌿 Configurando rama main..."
git branch -M main

# Hacer push
echo "📤 Pusheando a GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Repositorio pusheado exitosamente!"
    echo "🔗 Puedes ver tu código en: $GITHUB_URL"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Configura GitHub Pages si quieres deployar"
    echo "2. Configura las variables de entorno en tu servidor"
    echo "3. Comparte el repositorio con otros desarrolladores"
else
    echo "❌ Error al pushear. Verifica:"
    echo "1. Que la URL sea correcta"
    echo "2. Que tengas permisos para el repositorio"
    echo "3. Que estés autenticado en GitHub"
fi 