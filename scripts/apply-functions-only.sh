#!/bin/bash

# Script para aplicar solo las funciones SQL sin migraciones de storage
# Uso: ./scripts/apply-functions-only.sh

set -e

echo "🚀 Aplicando funciones SQL a Supabase..."

# Verificar si Supabase CLI está disponible
if ! npx supabase --version &> /dev/null; then
    echo "❌ Supabase CLI no está disponible. Instalando..."
    npm install supabase --save-dev
fi

# Verificar si el proyecto está enlazado
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Proyecto no enlazado. Por favor, enlaza tu proyecto primero:"
    echo "   npx supabase link --project-ref TU_PROJECT_REF"
    exit 1
fi

echo "📦 Aplicando migración inicial (esquema de base de datos)..."
npx supabase db push

echo "🔧 Aplicando funciones SQL..."
echo "💡 Copia y pega el contenido de supabase/functions.sql en el SQL Editor de Supabase"

echo ""
echo "✅ Migración inicial aplicada exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve al SQL Editor de Supabase: https://supabase.com/dashboard/project/[PROJECT_ID]/sql"
echo "2. Copia y pega el contenido de supabase/functions.sql"
echo "3. Ejecuta las funciones para verificar que funcionan"
echo "4. Copia y pega el contenido de supabase/views.sql"
echo "5. Ejecuta las vistas para verificar que funcionan"
echo ""
echo "🔗 URLs útiles:"
echo "- SQL Editor: https://supabase.com/dashboard/project/[PROJECT_ID]/sql"
echo "- Table Editor: https://supabase.com/dashboard/project/[PROJECT_ID]/editor"
echo "- Storage: https://supabase.com/dashboard/project/[PROJECT_ID]/storage"
echo ""
echo "💡 Para storage buckets:"
echo "- Crea los buckets manualmente desde el dashboard de Supabase"
echo "- Usa las funciones de storage desde supabase/functions.sql"
echo "- Usa las vistas de storage desde supabase/views.sql" 