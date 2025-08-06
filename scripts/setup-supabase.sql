-- Script de configuración automática de Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
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
CREATE TABLE IF NOT EXISTS photography (
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
CREATE TABLE IF NOT EXISTS projects (
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
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('photography', 'project')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
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
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_photography_updated_at ON photography;
CREATE TRIGGER update_photography_updated_at BEFORE UPDATE ON photography FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad (RLS)
-- Perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Fotografías
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Photography is viewable by everyone" ON photography;
CREATE POLICY "Photography is viewable by everyone" ON photography FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only authenticated users can insert photography" ON photography;
CREATE POLICY "Only authenticated users can insert photography" ON photography FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Only authenticated users can update photography" ON photography;
CREATE POLICY "Only authenticated users can update photography" ON photography FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Only authenticated users can delete photography" ON photography;
CREATE POLICY "Only authenticated users can delete photography" ON photography FOR DELETE USING (auth.role() = 'authenticated');

-- Proyectos
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only authenticated users can insert projects" ON projects;
CREATE POLICY "Only authenticated users can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Only authenticated users can update projects" ON projects;
CREATE POLICY "Only authenticated users can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Only authenticated users can delete projects" ON projects;
CREATE POLICY "Only authenticated users can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Etiquetas
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only authenticated users can insert tags" ON tags;
CREATE POLICY "Only authenticated users can insert tags" ON tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Only authenticated users can delete tags" ON tags;
CREATE POLICY "Only authenticated users can delete tags" ON tags FOR DELETE USING (auth.role() = 'authenticated');

-- Contactos
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only authenticated users can view contacts" ON contacts;
CREATE POLICY "Only authenticated users can view contacts" ON contacts FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Anyone can insert contacts" ON contacts;
CREATE POLICY "Anyone can insert contacts" ON contacts FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Only authenticated users can update contacts" ON contacts;
CREATE POLICY "Only authenticated users can update contacts" ON contacts FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Only authenticated users can delete contacts" ON contacts;
CREATE POLICY "Only authenticated users can delete contacts" ON contacts FOR DELETE USING (auth.role() = 'authenticated');

-- Insertar datos de ejemplo
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
('Supabase', 'project')
ON CONFLICT (name) DO NOTHING;

-- Mensaje de confirmación
SELECT 'Configuración de Supabase completada exitosamente!' as status;
