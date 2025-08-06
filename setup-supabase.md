# 🚀 Configuración de Supabase - Guía Paso a Paso

## 1. Crear Proyecto en Supabase

### Paso 1: Acceder a Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub o crea una cuenta

### Paso 2: Crear Nuevo Proyecto
1. Haz clic en "New Project"
2. Selecciona tu organización
3. **Nombre del proyecto**: `mi-plantilla-web`
4. **Database Password**: Genera una contraseña segura (guárdala)
5. **Region**: Elige la más cercana a ti
6. Haz clic en "Create new project"

### Paso 3: Esperar Configuración
- El proyecto tardará unos minutos en configurarse
- Verás un mensaje "Setting up your database..."

## 2. Obtener Credenciales

### Paso 1: Ir a Settings > API
1. En tu proyecto de Supabase, ve a "Settings" (ícono de engranaje)
2. Haz clic en "API" en el menú lateral

### Paso 2: Copiar Credenciales
1. **Project URL**: Copia la URL del proyecto
2. **anon public**: Copia la clave anónima pública

### Paso 3: Configurar Variables de Entorno
Edita el archivo `.env` con tus credenciales:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

## 3. Crear Tablas en la Base de Datos

### Paso 1: Ir a SQL Editor
1. En Supabase, ve a "SQL Editor" en el menú lateral
2. Haz clic en "New query"

### Paso 2: Ejecutar Script de Tablas
Copia y pega este SQL:

```sql
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fotografías
CREATE TABLE photography (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  price DECIMAL(10,2),
  location TEXT,
  date DATE NOT NULL,
  tags TEXT[],
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  technologies TEXT[],
  role TEXT NOT NULL,
  status TEXT DEFAULT 'planned' CHECK (status IN ('completed', 'in-progress', 'planned')),
  external_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de etiquetas
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('photography', 'project')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contactos
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photography_updated_at BEFORE UPDATE ON photography FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Paso 3: Ejecutar Query
1. Haz clic en "Run" para ejecutar el script
2. Verifica que no hay errores

## 4. Configurar Políticas de Seguridad (RLS)

### Paso 1: Ejecutar Políticas
Copia y pega este SQL:

```sql
-- Políticas para perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para fotografías (públicas para lectura, autenticadas para escritura)
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Photography is viewable by everyone" ON photography FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert photography" ON photography FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update photography" ON photography FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete photography" ON photography FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para proyectos
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para etiquetas
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert tags" ON tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete tags" ON tags FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para contactos
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only authenticated users can view contacts" ON contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated users can update contacts" ON contacts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete contacts" ON contacts FOR DELETE USING (auth.role() = 'authenticated');
```

## 5. Configurar Storage

### Paso 1: Crear Buckets
1. Ve a "Storage" en el menú lateral
2. Haz clic en "Create a new bucket"
3. Crea los siguientes buckets:

#### Bucket: `avatars`
- **Name**: `avatars`
- **Public bucket**: ✅ Sí
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

#### Bucket: `photography`
- **Name**: `photography`
- **Public bucket**: ✅ Sí
- **File size limit**: 10MB
- **Allowed MIME types**: `image/*`

#### Bucket: `projects`
- **Name**: `projects`
- **Public bucket**: ✅ Sí
- **File size limit**: 10MB
- **Allowed MIME types**: `image/*`

### Paso 2: Configurar Políticas de Storage
Copia y pega este SQL:

```sql
-- Políticas para bucket avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Políticas para bucket photography
CREATE POLICY "Photography images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'photography');
CREATE POLICY "Users can upload photography" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photography' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update photography" ON storage.objects FOR UPDATE USING (bucket_id = 'photography' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete photography" ON storage.objects FOR DELETE USING (bucket_id = 'photography' AND auth.role() = 'authenticated');

-- Políticas para bucket projects
CREATE POLICY "Project images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Users can upload project images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update project images" ON storage.objects FOR UPDATE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete project images" ON storage.objects FOR DELETE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
```

## 6. Crear Usuario Administrador

### Paso 1: Ir a Authentication
1. Ve a "Authentication" en el menú lateral
2. Haz clic en "Users"

### Paso 2: Crear Usuario
1. Haz clic en "Add user"
2. **Email**: `admin@ejemplo.com`
3. **Password**: `admin123` (cambia esto en producción)
4. Haz clic en "Create user"

### Paso 3: Verificar Usuario
1. El usuario aparecerá en la lista
2. El estado debe ser "Confirmed"

## 7. Insertar Datos de Ejemplo

### Paso 1: Insertar Perfil
```sql
INSERT INTO profiles (id, name, email, bio, location, website, github, linkedin, twitter)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@ejemplo.com'),
  'Tu Nombre',
  'admin@ejemplo.com',
  'Desarrollador web apasionado y fotógrafo creativo.',
  'Ciudad, País',
  'https://tu-sitio.com',
  'https://github.com/tu-usuario',
  'https://linkedin.com/in/tu-perfil',
  'https://twitter.com/tu-usuario'
);
```

### Paso 2: Insertar Etiquetas de Ejemplo
```sql
INSERT INTO tags (name, category) VALUES
('naturaleza', 'photography'),
('paisaje', 'photography'),
('urbano', 'photography'),
('retrato', 'photography'),
('arquitectura', 'photography'),
('React', 'project'),
('TypeScript', 'project'),
('Node.js', 'project'),
('Astro', 'project'),
('Tailwind CSS', 'project'),
('Supabase', 'project');
```

## 8. Verificar Configuración

### Paso 1: Probar Conexión
1. Ejecuta `npm run dev` en tu proyecto
2. Ve a `http://localhost:4321/admin/login`
3. Inicia sesión con `admin@ejemplo.com` / `admin123`

### Paso 2: Verificar Funcionalidad
1. Navega por el dashboard
2. Prueba añadir una fotografía
3. Prueba añadir un proyecto
4. Verifica que las imágenes se suben correctamente

## 9. Configuración de Producción

### Paso 1: Cambiar Credenciales
1. Cambia la contraseña del usuario admin
2. Actualiza las variables de entorno para producción
3. Configura un dominio personalizado

### Paso 2: Configurar Email
1. Ve a "Authentication" > "Settings"
2. Configura un proveedor de email (SendGrid, etc.)
3. Configura las plantillas de email

### Paso 3: Monitoreo
1. Ve a "Logs" para monitorear actividad
2. Configura alertas si es necesario

## ✅ ¡Listo!

Tu CMS está completamente configurado y listo para usar. Puedes:
- Gestionar fotografías y proyectos
- Subir imágenes
- Recibir formularios de contacto
- Personalizar tu perfil

¿Necesitas ayuda con algún paso específico?
