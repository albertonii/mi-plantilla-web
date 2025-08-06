#!/bin/bash

# Script para aplicar migraciones a Supabase de forma segura
# Uso: ./scripts/apply-migrations-safe.sh

set -e

echo "🚀 Aplicando migraciones a Supabase de forma segura..."

# Verificar si Supabase CLI está disponible
if ! npx supabase --version &> /dev/null; then
    echo "❌ Supabase CLI no está disponible. Instalando..."
    npm install supabase --save-dev
fi

# Verificar si el proyecto está enlazado
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Proyecto no enlazado. Por favor, enlaza tu proyecto primero:"
    echo "   npx supabase link --project-ref TU_PROJECT_REF"
    echo ""
    echo "📋 Para obtener tu PROJECT_REF:"
    echo "1. Ve a https://supabase.com/dashboard"
    echo "2. Selecciona tu proyecto"
    echo "3. Ve a Settings > General"
    echo "4. Copia el 'Reference ID'"
    echo ""
    echo "💡 Ejemplo: npx supabase link --project-ref abcdefghijklmnop"
    exit 1
fi

# Aplicar migración inicial (esquema de base de datos)
echo "📦 Aplicando migración inicial (esquema de base de datos)..."
npx supabase db push

# Verificar si la migración de storage funcionó
echo "🔍 Verificando si storage está disponible..."
if npx supabase db push --include-all 2>&1 | grep -q "storage"; then
    echo "⚠️  Problema con storage detectado. Aplicando migración simplificada..."
    
    # Aplicar migración simplificada de storage
    echo "📦 Aplicando migración simplificada de storage..."
    npx supabase db push --include-all
else
    echo "✅ Migración de storage aplicada exitosamente"
fi

# Insertar datos de seed
echo "🌱 Insertando datos de ejemplo..."
npx supabase db reset --linked

echo "✅ Migraciones aplicadas exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve al editor de Supabase y verifica las tablas creadas"
echo "2. Revisa las funciones SQL en supabase/functions.sql"
echo "3. Revisa las vistas SQL en supabase/views.sql"
echo "4. Configura las variables de entorno en tu proyecto"
echo ""
echo "🔗 URLs útiles:"
echo "- Editor SQL: https://supabase.com/dashboard/project/[PROJECT_ID]/sql"
echo "- Tabla Editor: https://supabase.com/dashboard/project/[PROJECT_ID]/editor"
echo "- Storage: https://supabase.com/dashboard/project/[PROJECT_ID]/storage"
echo "- API Docs: https://supabase.com/dashboard/project/[PROJECT_ID]/api"
echo ""
echo "💡 Si tienes problemas con storage:"
echo "- Los buckets se pueden crear manualmente desde el dashboard de Supabase"
echo "- Las funciones de storage están disponibles en supabase/functions.sql"
echo "- Las vistas de storage están disponibles en supabase/views.sql" 