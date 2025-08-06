# Configuración de Supabase para Mi Plantilla Web

Este directorio contiene toda la configuración necesaria para trabajar con Supabase, incluyendo migraciones, funciones SQL, storage buckets y datos de ejemplo.

## Estructura del Proyecto

```
supabase/
├── config.toml          # Configuración del CLI de Supabase
├── migrations/          # Archivos de migración
│   ├── 20240101000000_initial_schema.sql
│   └── 20240101000001_storage_buckets.sql
├── seed/               # Datos de ejemplo
│   └── seed.sql
├── functions.sql       # Funciones SQL personalizadas
├── views.sql          # Vistas SQL para consultas comunes
├── editor-examples.sql # Ejemplos de consultas
└── README.md          # Este archivo
```

## Cómo Usar

### 1. Configurar Supabase CLI

Si no tienes el CLI de Supabase instalado:

```bash
npm install supabase --save-dev
```

### 2. Inicializar el Proyecto

```bash
# Enlazar con tu proyecto de Supabase
npx supabase link --project-ref TU_PROJECT_REF

# Iniciar Supabase localmente (opcional)
npx supabase start
```

### 3. Aplicar Migraciones

```bash
# Aplicar migraciones a tu proyecto remoto
npx supabase db push

# O aplicar solo las migraciones locales
npx supabase migration up
```

### 4. Insertar Datos de Ejemplo

```bash
# Insertar datos de seed
npx supabase db reset
```

## Archivos para el Editor de Supabase

### Migración Inicial (`migrations/20240101000000_initial_schema.sql`)

Contiene:

- ✅ Todas las tablas (profiles, photography, projects, tags, contacts)
- ✅ Configuración de triggers para `updated_at`
- ✅ Políticas de seguridad (RLS)
- ✅ Extensiones necesarias

### Migración de Storage (`migrations/20240101000001_storage_buckets.sql`)

Contiene:

- ✅ 4 buckets de storage configurados:
  - `photography` - Para imágenes de fotografías (50MB, público)
  - `avatars` - Para avatares de usuarios (5MB, público)
  - `projects` - Para imágenes de proyectos (10MB, público)
  - `temp` - Para archivos temporales (10MB, privado)
- ✅ Políticas de seguridad para cada bucket
- ✅ Funciones de utilidad para storage
- ✅ Configuración de tipos MIME permitidos

### Funciones SQL (`functions.sql`)

Funciones útiles incluyen:

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
- `generate_signed_url()` - URLs firmadas

### Vistas SQL (`views.sql`)

Vistas útiles incluyen:

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

### Datos de Ejemplo (`seed/seed.sql`)

Incluye:

- 🏷️ Etiquetas predefinidas para fotografía y proyectos
- 📸 Fotografías de ejemplo con imágenes de Unsplash
- 💼 Proyectos de ejemplo

## Cómo Añadir Código en el Editor de Supabase

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

1. **Añadir en `supabase/functions.sql`**
2. **O crear archivos separados** para funciones específicas
3. **Ejecutar en el SQL Editor** de Supabase

### Para Vistas:

1. **Añadir en `supabase/views.sql`**
2. **Ejecutar en el SQL Editor**
3. **Consultar directamente** desde tu aplicación

### Para Storage:

1. **Los buckets se crean automáticamente** con la migración
2. **Usar las funciones de storage** para gestionar archivos
3. **Consultar las vistas de storage** para análisis

## Comandos Útiles

```bash
# Ver estado de las migraciones
npx supabase migration list

# Crear nueva migración
npx supabase migration new nombre_migracion

# Aplicar migraciones
npx supabase db push

# Resetear base de datos (cuidado: borra todos los datos)
npx supabase db reset

# Generar tipos TypeScript
npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/supabase.ts

# Ver buckets de storage
npx supabase storage ls

# Subir archivo a storage
npx supabase storage upload photography ruta/al/archivo.jpg
```

## Estructura de la Base de Datos

### Tablas Principales:

- **profiles**: Perfiles de usuario
- **photography**: Galería de fotografías
- **projects**: Portfolio de proyectos
- **tags**: Sistema de etiquetas
- **contacts**: Formulario de contacto

### Storage Buckets:

- **photography**: Imágenes de fotografías (50MB, público)
- **avatars**: Avatares de usuarios (5MB, público)
- **projects**: Imágenes de proyectos (10MB, público)
- **temp**: Archivos temporales (10MB, privado)

### Políticas de Seguridad:

- RLS habilitado en todas las tablas
- Usuarios autenticados pueden gestionar contenido
- Fotografías y proyectos visibles para todos
- Contactos solo visibles para usuarios autenticados
- Storage con políticas específicas por bucket

## Notas Importantes

- Todas las tablas tienen timestamps automáticos (`created_at`, `updated_at`)
- Los triggers actualizan automáticamente `updated_at`
- Las políticas RLS están configuradas para seguridad
- Las funciones están marcadas como `SECURITY DEFINER` para permisos adecuados
- Los buckets de storage tienen límites de tamaño y tipos MIME configurados
- Funciones de limpieza automática para archivos temporales

## Ejemplos de Uso de Storage

### Subir Imagen de Fotografía:

```javascript
const { data, error } = await supabase.storage
  .from("photography")
  .upload("mi-foto.jpg", file);
```

### Obtener URL Pública:

```javascript
const { data } = supabase.storage
  .from("photography")
  .getPublicUrl("mi-foto.jpg");
```

### Listar Archivos:

```javascript
const { data, error } = await supabase.storage.from("photography").list();
```

### Eliminar Archivo:

```javascript
const { data, error } = await supabase.storage
  .from("photography")
  .remove(["mi-foto.jpg"]);
```
