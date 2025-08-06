#!/bin/bash

# Script para crear usuario admin
# Uso: ./scripts/create-admin.sh

set -e

echo "🚀 Creando usuario admin..."

# Encontrar la raíz del proyecto (donde está el archivo .env)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📁 Buscando archivo .env en: $PROJECT_ROOT"

# Cargar variables de entorno desde .env
if [ -f "$PROJECT_ROOT/.env" ]; then
    echo "📁 Cargando variables de entorno desde .env..."
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
else
    echo "❌ Archivo .env no encontrado en $PROJECT_ROOT"
    echo "Crea un archivo .env en la raíz del proyecto con las variables necesarias"
    exit 1
fi

# Verificar si las variables de entorno están configuradas
if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ Error: Variables de entorno de admin no encontradas"
    echo ""
    echo "📋 Asegúrate de tener estas variables en tu archivo .env:"
    echo "   ADMIN_EMAIL=tu-email@ejemplo.com"
    echo "   ADMIN_PASSWORD=tu-contraseña-segura"
    echo ""
    echo "💡 Ejemplo de .env:"
    echo "   PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co"
    echo "   PUBLIC_SUPABASE_ANON_KEY=tu-anon-key"
    echo "   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key"
    echo "   ADMIN_EMAIL=admin@tu-dominio.com"
    echo "   ADMIN_PASSWORD=Admin123!"
    echo ""
    exit 1
fi

echo "📧 Email: $ADMIN_EMAIL"
echo ""

# Verificar si Node.js está disponible
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "📝 Ejecutando script de creación de usuario admin..."
echo ""

# Cambiar al directorio del proyecto y ejecutar el script de Node.js
cd "$PROJECT_ROOT"
if node scripts/create-admin-user-simple.js; then
    echo ""
    echo "✅ Usuario admin creado exitosamente!"
    echo ""
    echo "🔗 Próximos pasos:"
    echo "1. Ve a tu aplicación en http://localhost:4321"
    echo "2. Navega a /admin/login"
    echo "3. Inicia sesión con las credenciales:"
    echo "   Email: $ADMIN_EMAIL"
    echo "   Password: $ADMIN_PASSWORD"
    echo ""
    echo "💡 Si tienes problemas:"
    echo "- Verifica que las migraciones se hayan aplicado correctamente"
    echo "- Asegúrate de que las variables de entorno estén correctas"
    echo "- Revisa los logs de Supabase en el dashboard"
else
    echo ""
    echo "❌ Error al crear usuario admin"
    echo ""
    echo "💡 Soluciones posibles:"
    echo "1. Verifica que SUPABASE_SERVICE_ROLE_KEY esté en tu .env"
    echo "2. Asegúrate de que las migraciones se hayan aplicado"
    echo "3. Verifica que el proyecto de Supabase esté activo"
    echo ""
    echo "🔗 Para obtener SUPABASE_SERVICE_ROLE_KEY:"
    echo "1. Ve a tu dashboard de Supabase"
    echo "2. Settings > API"
    echo "3. Copia 'service_role' key"
    echo ""
    exit 1
fi 