#!/bin/bash

# Script de configuración automática de Supabase
# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configuración de Supabase para Mi Plantilla Web${NC}"
echo "=================================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "Asegúrate de estar en el directorio del proyecto"
    exit 1
fi

echo -e "${GREEN}✅ Directorio del proyecto verificado${NC}"
echo ""

# Verificar archivo .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
    echo "Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
else
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
fi

echo ""
echo -e "${BLUE}📋 Pasos para configurar Supabase:${NC}"
echo ""

echo "1. 🌐 Crear proyecto en Supabase:"
echo "   - Ve a https://supabase.com"
echo "   - Haz clic en 'Start your project'"
echo "   - Crea un nuevo proyecto llamado 'mi-plantilla-web'"
echo ""

echo "2. 🔑 Obtener credenciales:"
echo "   - Ve a Settings > API en tu proyecto"
echo "   - Copia la Project URL y anon public key"
echo "   - Actualiza el archivo .env con estas credenciales"
echo ""

echo "3. 🗄️  Configurar base de datos:"
echo "   - Ve a SQL Editor en Supabase"
echo "   - Crea una nueva query"
echo "   - Copia y pega el contenido de scripts/setup-supabase.sql"
echo "   - Ejecuta el script"
echo ""

echo "4. 📦 Configurar Storage:"
echo "   - Ve a Storage en Supabase"
echo "   - Crea los siguientes buckets:"
echo "     * avatars (público, 5MB, image/*)"
echo "     * photography (público, 10MB, image/*)"
echo "     * projects (público, 10MB, image/*)"
echo "   - Ejecuta el script scripts/setup-storage.sql"
echo ""

echo "5. 👤 Crear usuario administrador:"
echo "   - Ve a Authentication > Users"
echo "   - Haz clic en 'Add user'"
echo "   - Email: admin@ejemplo.com"
echo "   - Password: admin123"
echo ""

echo "6. ✅ Verificar configuración:"
echo "   - Ejecuta el script scripts/verify-setup.sql"
echo "   - Verifica que todos los números sean correctos"
echo ""

echo -e "${YELLOW}📝 Notas importantes:${NC}"
echo "- Cambia la contraseña del admin en producción"
echo "- Configura un dominio personalizado"
echo "- Configura un proveedor de email para autenticación"
echo ""

echo -e "${GREEN}🎉 ¡Listo para empezar!${NC}"
echo ""
echo "Para probar la configuración:"
echo "1. npm run dev"
echo "2. Ve a http://localhost:4321/admin/login"
echo "3. Inicia sesión con admin@ejemplo.com / admin123"
echo ""

# Mostrar contenido del archivo .env
echo -e "${BLUE}📄 Contenido actual del archivo .env:${NC}"
echo "----------------------------------------"
if [ -f ".env" ]; then
    cat .env
else
    echo "Archivo .env no encontrado"
fi
echo "----------------------------------------"
echo ""

echo -e "${YELLOW}💡 Tip: Edita el archivo .env con tus credenciales reales de Supabase${NC}"
