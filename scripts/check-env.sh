#!/bin/bash

# Script para verificar la configuración de variables de entorno
# Uso: ./scripts/check-env.sh

set -e

echo "🔍 Verificando configuración de variables de entorno..."
echo ""

# Encontrar la raíz del proyecto (donde está el archivo .env)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📁 Buscando archivo .env en: $PROJECT_ROOT"

# Verificar si existe el archivo .env
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo "❌ Archivo .env no encontrado"
    echo ""
    echo "📋 Crea un archivo .env en la raíz del proyecto con:"
    echo ""
    echo "PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co"
    echo "PUBLIC_SUPABASE_ANON_KEY=tu-anon-key"
    echo "SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key"
    echo "ADMIN_EMAIL=admin@tu-dominio.com"
    echo "ADMIN_PASSWORD=Admin123!"
    echo ""
    exit 1
fi

echo "✅ Archivo .env encontrado"
echo ""

# Cargar variables de entorno
export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)

# Verificar variables de Supabase
echo "🔑 Verificando variables de Supabase..."

if [ -z "$PUBLIC_SUPABASE_URL" ]; then
    echo "❌ PUBLIC_SUPABASE_URL no encontrada"
else
    echo "✅ PUBLIC_SUPABASE_URL: ${PUBLIC_SUPABASE_URL:0:50}..."
fi

if [ -z "$PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ PUBLIC_SUPABASE_ANON_KEY no encontrada"
else
    echo "✅ PUBLIC_SUPABASE_ANON_KEY: ${PUBLIC_SUPABASE_ANON_KEY:0:50}..."
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY no encontrada"
else
    echo "✅ SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:0:50}..."
fi

echo ""

# Verificar variables de admin
echo "👤 Verificando variables de admin..."

if [ -z "$ADMIN_EMAIL" ]; then
    echo "❌ ADMIN_EMAIL no encontrada"
else
    echo "✅ ADMIN_EMAIL: $ADMIN_EMAIL"
fi

if [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ ADMIN_PASSWORD no encontrada"
else
    echo "✅ ADMIN_PASSWORD: ${ADMIN_PASSWORD:0:10}..."
fi

echo ""

# Verificar si todas las variables están presentes
if [ -n "$PUBLIC_SUPABASE_URL" ] && [ -n "$PUBLIC_SUPABASE_ANON_KEY" ] && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "🎉 ¡Todas las variables están configuradas correctamente!"
    echo ""
    echo "🚀 Puedes ejecutar: ./scripts/create-admin.sh"
    echo ""
else
    echo "❌ Faltan algunas variables de entorno"
    echo ""
    echo "💡 Asegúrate de que tu archivo .env contenga todas las variables necesarias"
    echo ""
    exit 1
fi 