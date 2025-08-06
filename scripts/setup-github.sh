#!/bin/bash

# Script para configurar y pushear a GitHub
# Uso: ./scripts/setup-github.sh

echo "🚀 Configurando repositorio para GitHub..."

# Verificar si git está inicializado
if [ ! -d ".git" ]; then
    echo "❌ Error: No es un repositorio git"
    exit 1
fi

# Verificar el estado actual
echo "📋 Estado actual del repositorio:"
git status

echo ""
echo "🔧 Pasos para configurar GitHub:"
echo ""
echo "1. Ve a https://github.com/new"
echo "2. Crea un nuevo repositorio llamado 'mi-plantilla-web'"
echo "3. NO inicialices con README, .gitignore o licencia"
echo "4. Copia la URL del repositorio (algo como: https://github.com/tu-usuario/mi-plantilla-web.git)"
echo ""
echo "5. Una vez creado, ejecuta estos comandos:"
echo ""
echo "   git remote add origin https://github.com/tu-usuario/mi-plantilla-web.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "💡 O si prefieres, puedes ejecutar:"
echo "   ./scripts/push-to-github.sh https://github.com/tu-usuario/mi-plantilla-web.git"
echo ""

# Verificar si ya hay commits
commit_count=$(git rev-list --count HEAD 2>/dev/null || echo "0")

if [ "$commit_count" -eq "0" ]; then
    echo "⚠️  No hay commits en el repositorio"
    echo "💡 Ejecuta estos comandos primero:"
    echo "   git add ."
    echo "   git commit -m 'Initial commit: Portfolio website with Supabase integration'"
    echo ""
fi

echo "✅ Script completado" 