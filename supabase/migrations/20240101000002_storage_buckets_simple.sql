-- Migración simplificada para Storage Buckets de Supabase
-- Fecha: 2024-01-01
-- Descripción: Configuración básica de buckets de almacenamiento

-- Bucket para fotografías
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photography',
  'photography',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para avatares de usuarios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para imágenes de proyectos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para archivos temporales/borradores
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'temp',
  'temp',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas básicas de seguridad para el bucket de fotografías
DROP POLICY IF EXISTS "Fotografías visibles públicamente" ON storage.objects;
CREATE POLICY "Fotografías visibles públicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'photography');

DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar fotografías" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden gestionar fotografías" ON storage.objects
  FOR ALL USING (bucket_id = 'photography' AND auth.role() = 'authenticated');

-- Políticas básicas de seguridad para el bucket de avatares
DROP POLICY IF EXISTS "Avatares visibles públicamente" ON storage.objects;
CREATE POLICY "Avatares visibles públicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar avatares" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden gestionar avatares" ON storage.objects
  FOR ALL USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Políticas básicas de seguridad para el bucket de proyectos
DROP POLICY IF EXISTS "Imágenes de proyectos visibles públicamente" ON storage.objects;
CREATE POLICY "Imágenes de proyectos visibles públicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar imágenes de proyectos" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden gestionar imágenes de proyectos" ON storage.objects
  FOR ALL USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- Políticas básicas de seguridad para el bucket temporal
DROP POLICY IF EXISTS "Usuarios autenticados pueden acceder a archivos temporales" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden acceder a archivos temporales" ON storage.objects
  FOR ALL USING (bucket_id = 'temp' AND auth.role() = 'authenticated'); 