# 🚀 Guía de Migración para Supabase

¡Perfecto! He configurado toda la estructura de migraciones para que puedas añadir código en el editor de Supabase. Aquí tienes todo lo que necesitas saber.

## 📁 Estructura Creada

```
supabase/
├── config.toml              # Configuración del CLI
├── migrations/
│   ├── 20240101000000_initial_schema.sql  # Esquema inicial
│   ├── 20240101000001_storage_buckets.sql # Storage buckets (problemático)
│   └── 20240101000002_storage_buckets_simple.sql # Storage simplificado
├── seed/
│   └── seed.sql             # Datos de ejemplo
├── functions.sql            # Funciones SQL completas
├── functions-db-only.sql    # Solo funciones de BD (recomendado)
├── views.sql               # Vistas SQL útiles
├── editor-examples.sql     # Ejemplos de consultas
├── README.md               # Documentación completa
└── config.ts               # Configuración del cliente
```

## 🎯 Próximos Pasos

### 1. Configurar Supabase (Automático)

```bash
# Ejecutar el script de configuración
./scripts/setup-supabase.sh
```

Este script te guiará para:

- Instalar el CLI de Supabase
- Obtener tu PROJECT_REF
- Enlazar tu proyecto

### 2. Aplicar las Migraciones (Opción Recomendada)

```bash
# Opción A: Solo esquema de base de datos (recomendado)
./scripts/apply-functions-only.sh

# Opción B: Script seguro con manejo de errores
./scripts/apply-migrations-safe.sh

# Opción C: Comandos manuales
npx supabase db push
npx supabase db reset --linked
```

### 3. Aplicar Funciones SQL Manualmente

1. Ve al **SQL Editor** de Supabase
2. Copia y pega el contenido de `supabase/functions-db-only.sql`
3. Ejecuta las funciones para verificar que funcionan
4. Copia y pega el contenido de `supabase/views.sql`
5. Ejecuta las vistas para verificar que funcionan

### 4. Configurar Storage Manualmente

Si necesitas storage buckets:

1. Ve al dashboard de Supabase → Storage
2. Crea los buckets manualmente:
   - `photography` (50MB, público)
   - `avatars` (5MB, público)
   - `projects` (10MB, público)
   - `temp` (10MB, privado)
3. Copia y pega las funciones de storage desde `supabase/functions.sql`

### 5. Crear Usuario Admin

Para acceder al panel de administración:

#### Opción A: Script Automático (Recomendado)

1. **Configurar variables de entorno:**

   ```bash
   # Crear archivo .env con las variables necesarias
   # Ver ENV-SETUP.md para instrucciones detalladas
   ```

2. **Ejecutar script de creación:**
   ```bash
   ./scripts/create-admin.sh
   ```

#### Opción B: Crear Manualmente

1. Ve al dashboard de Supabase
2. Navega a **Authentication > Users**
3. Haz clic en **"Add user"**
4. Completa con tus credenciales de admin

### 6. Acceder al Panel de Administración

1. Inicia tu aplicación:

   ```bash
   npm run dev
   ```

2. Ve a: `http://localhost:4321/admin/login`

3. Inicia sesión con tus credenciales de admin

## 🔧 Archivos para el Editor de Supabase

### Migración Inicial

**Archivo:** `supabase/migrations/20240101000000_initial_schema.sql`

**Contiene:**

- ✅ Todas las tablas (profiles, photography, projects, tags, contacts)
- ✅ Triggers para `updated_at` automático
- ✅ Políticas de seguridad (RLS)
- ✅ Extensiones necesarias

### Funciones SQL (Recomendado)

**Archivo:** `supabase/functions-db-only.sql`

**Funciones incluidas:**

- `get_photography_stats()` - Estadísticas de fotos
- `search_photography_by_tags()` - Búsqueda por etiquetas
- `get_projects_by_technology()` - Proyectos por tecnología
- `get_unread_contacts()` - Contactos no leídos
- `mark_contact_as_read()` - Marcar como leído
- `get_popular_tags()` - Etiquetas populares

### Funciones SQL Completas

**Archivo:** `supabase/functions.sql`

**Funciones incluidas:**

**Funciones de Base de Datos:**

- `get_photography_stats()` - Estadísticas de fotos
- `search_photography_by_tags()` - Búsqueda por etiquetas
- `get_projects_by_technology()` - Proyectos por tecnología
- `get_unread_contacts()` - Contactos no leídos
- `mark_contact_as_read()` - Marcar como leído
- `get_popular_tags()` - Etiquetas populares

**Funciones de Storage:**

- `get_storage_stats()` - Estadísticas de storage
- `get_files_by_bucket()` - Archivos por bucket
- `get_large_files()` - Archivos grandes
- `get_files_by_mime_type()` - Archivos por tipo MIME
- `get_recent_files()` - Archivos recientes
- `get_orphaned_files()` - Archivos huérfanos
- `cleanup_temp_files()` - Limpiar archivos temporales
- `get_public_url()` - URL pública de archivo

### Vistas SQL

**Archivo:** `supabase/views.sql`

**Vistas incluidas:**

**Vistas de Base de Datos:**

- `photography_with_tags` - Fotos con etiquetas
- `projects_with_technologies` - Proyectos con tecnologías
- `admin_dashboard` - Dashboard de admin
- `available_photography` - Solo fotos disponibles
- `recent_contacts` - Contactos recientes

**Vistas de Storage:**

- `storage_files_overview` - Archivos con información completa
- `storage_bucket_stats` - Estadísticas por bucket
- `image_files` - Solo archivos de imágenes
- `large_files` - Archivos grandes
- `recent_files` - Archivos recientes
- `files_by_mime_type` - Archivos por tipo MIME
- `orphaned_files` - Archivos huérfanos
- `storage_dashboard` - Dashboard de storage

### Datos de Ejemplo

**Archivo:** `supabase/seed/seed.sql`

**Incluye:**

- 🏷️ Etiquetas predefinidas
- 📸 Fotografías de ejemplo
- 💼 Proyectos de ejemplo

## 📝 Cómo Añadir Código en el Editor

### Para Nuevas Migraciones:

1. **Crear nueva migración:**

   ```bash
   npx supabase migration new nombre_migracion
   ```

2. **Editar el archivo generado** en `supabase/migrations/`

3. **Aplicar cambios:**

   ```bash
   npx supabase db push
   ```

### Para Funciones SQL:

1. **Añadir en `supabase/functions-db-only.sql`** (recomendado)
2. **O añadir en `supabase/functions.sql`** (completo)
3. **Ejecutar en el SQL Editor** de Supabase

### Para Vistas:

1. **Añadir en `supabase/views.sql`**
2. **Ejecutar en el SQL Editor**
3. **Consultar directamente** desde tu aplicación

### Para Storage:

1. **Crear buckets manualmente** desde el dashboard de Supabase
2. **Usar las funciones de storage** desde `supabase/functions.sql`
3. **Consultar las vistas de storage** desde `supabase/views.sql`

## 🎨 Ejemplos de Consultas

Copia y pega estas consultas en el **SQL Editor** de Supabase:

```sql
-- Ver todas las fotografías disponibles
SELECT * FROM photography WHERE status = 'available';

-- Ver estadísticas del dashboard
SELECT * FROM admin_dashboard;

-- Buscar fotos por etiquetas
SELECT * FROM search_photography_by_tags(ARRAY['naturaleza', 'paisaje']);

-- Ver proyectos que usan React
SELECT * FROM get_projects_by_technology('React');

-- Ver buckets de storage (si están creados)
SELECT * FROM storage.buckets;

-- Ver estadísticas de storage (si están creados)
SELECT * FROM get_storage_stats();
```

## 🔗 URLs Útiles

- **SQL Editor:** `https://supabase.com/dashboard/project/[PROJECT_ID]/sql`
- **Table Editor:** `https://supabase.com/dashboard/project/[PROJECT_ID]/editor`
- **Storage:** `https://supabase.com/dashboard/project/[PROJECT_ID]/storage`
- **API Docs:** `https://supabase.com/dashboard/project/[PROJECT_ID]/api`
- **Settings:** `https://supabase.com/dashboard/project/[PROJECT_ID]/settings`

## 🚨 Comandos Importantes

```bash
# Ver estado de las migraciones
npx supabase migration list

# Crear nueva migración
npx supabase migration new nombre_migracion

# Aplicar migraciones
npx supabase db push

# Resetear base de datos (¡cuidado!)
npx supabase db reset

# Generar tipos TypeScript
npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/supabase.ts

# Ver buckets de storage
npx supabase storage ls

# Subir archivo a storage
npx supabase storage upload photography ruta/al/archivo.jpg

# Crear usuario admin
./scripts/create-admin.sh
```

## ✅ Verificación

Después de aplicar las migraciones, deberías ver:

1. **5 tablas creadas:** profiles, photography, projects, tags, contacts
2. **6 funciones SQL** disponibles (de BD)
3. **8 vistas SQL** creadas (de BD)
4. **Datos de ejemplo** insertados
5. **Políticas RLS** configuradas
6. **Usuario admin** creado (si usaste el script)

## 🎉 ¡Listo!

Ahora puedes:

- ✅ Añadir código en el editor de Supabase
- ✅ Usar las funciones SQL predefinidas
- ✅ Consultar las vistas útiles
- ✅ Gestionar migraciones de forma organizada
- ✅ Tener datos de ejemplo para trabajar
- ✅ Gestionar archivos con storage buckets (manual)
- ✅ Analizar uso de storage con vistas especializadas
- ✅ Acceder al panel de administración

¡Tu proyecto está listo para el desarrollo con Supabase! 🚀
