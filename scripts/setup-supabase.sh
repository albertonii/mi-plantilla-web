#!/bin/bash

# Script para configurar Supabase
# Uso: ./scripts/setup-supabase.sh

set -e

echo "🔧 Configurando Supabase para el proyecto..."

# Verificar si Supabase CLI está disponible
if ! npx supabase --version &> /dev/null; then
    echo "📦 Instalando Supabase CLI..."
    npm install supabase --save-dev
fi

echo "✅ Supabase CLI disponible: $(npx supabase --version)"

echo ""
echo "📋 Para continuar, necesitas tu PROJECT_REF de Supabase:"
echo ""
echo "1. Ve a https://supabase.com/dashboard"
echo "2. Selecciona tu proyecto (o crea uno nuevo)"
echo "3. Ve a Settings > General"
echo "4. Copia el 'Reference ID'"
echo ""
echo "💡 Ejemplo de Reference ID: abcdefghijklmnop"
echo ""

read -p "🔗 Ingresa tu PROJECT_REF: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ PROJECT_REF es requerido"
    exit 1
fi

echo ""
echo "🔗 Enlazando proyecto con PROJECT_REF: $PROJECT_REF"
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "✅ Proyecto enlazado exitosamente!"
echo ""
echo "🚀 Ahora puedes aplicar las migraciones:"
echo "   ./scripts/apply-migrations.sh"
echo ""
echo "📋 O ejecutar los comandos manualmente:"
echo "   npx supabase db push"
echo "   npx supabase db reset --linked" 