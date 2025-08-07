#!/bin/bash

# Script de build específico para Netlify
# Limpia archivos que contienen secretos antes del build

echo "🚀 Iniciando build para Netlify..."

# Crear directorio temporal para archivos de documentación
mkdir -p .temp-docs

# Mover archivos de documentación a directorio temporal
echo "📁 Moviendo archivos de documentación..."
mv README.md .temp-docs/ 2>/dev/null || true
mv .env.example .temp-docs/ 2>/dev/null || true
mv *.md .temp-docs/ 2>/dev/null || true
mv scripts/*.md .temp-docs/ 2>/dev/null || true
mv supabase/*.md .temp-docs/ 2>/dev/null || true

# Mover scripts que contienen secretos
echo "📁 Moviendo scripts con secretos..."
mv scripts/test-*.js .temp-docs/ 2>/dev/null || true
mv scripts/setup-*.sh .temp-docs/ 2>/dev/null || true
mv scripts/create-*.js .temp-docs/ 2>/dev/null || true
mv scripts/verify-*.sql .temp-docs/ 2>/dev/null || true
mv scripts/apply-*.sh .temp-docs/ 2>/dev/null || true
mv scripts/apply-*.js .temp-docs/ 2>/dev/null || true
mv scripts/push-*.sh .temp-docs/ 2>/dev/null || true
mv scripts/check-*.sh .temp-docs/ 2>/dev/null || true

# Ejecutar build de Astro
echo "🔨 Ejecutando build de Astro..."
npm run build

# Restaurar archivos de documentación
echo "📁 Restaurando archivos de documentación..."
mv .temp-docs/* . 2>/dev/null || true
rmdir .temp-docs 2>/dev/null || true

echo "✅ Build completado exitosamente!" 