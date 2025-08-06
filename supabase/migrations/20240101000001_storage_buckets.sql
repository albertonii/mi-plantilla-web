-- Migración para Storage Buckets de Supabase
-- Fecha: 2024-01-01
-- Descripción: Configuración de buckets de almacenamiento para archivos

-- Nota: La extensión storage se maneja automáticamente por Supabase
-- No necesitamos crear la extensión manualmente

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

-- Políticas de seguridad para el bucket de fotografías
DROP POLICY IF EXISTS "Fotografías visibles públicamente" ON storage.objects;
CREATE POLICY "Fotografías visibles públicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'photography');

DROP POLICY IF EXISTS "Usuarios autenticados pueden subir fotografías" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir fotografías" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photography' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar fotografías" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden actualizar fotografías" ON storage.objects
  FOR UPDATE USING (bucket_id = 'photography' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar fotografías" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden eliminar fotografías" ON storage.objects
  FOR DELETE USING (bucket_id = 'photography' AND auth.role() = 'authenticated');

-- Políticas de seguridad para el bucket de avatares
DROP POLICY IF EXISTS "Avatares visibles públicamente" ON storage.objects;
CREATE POLICY "Avatares visibles públicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Usuarios pueden subir su propio avatar" ON storage.objects;
CREATE POLICY "Usuarios pueden subir su propio avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio avatar" ON storage.objects;
CREATE POLICY "Usuarios pueden actualizar su propio avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Usuarios pueden eliminar su propio avatar" ON storage.objects;
CREATE POLICY "Usuarios pueden eliminar su propio avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de seguridad para el bucket de proyectos
DROP POLICY IF EXISTS "Imágenes de proyectos visibles públicamente" ON storage.objects;
CREATE POLICY "Imágenes de proyectos visibles públicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes de proyectos" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir imágenes de proyectos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar imágenes de proyectos" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden actualizar imágenes de proyectos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar imágenes de proyectos" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes de proyectos" ON storage.objects
  FOR DELETE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- Políticas de seguridad para el bucket temporal
DROP POLICY IF EXISTS "Usuarios autenticados pueden acceder a archivos temporales" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden acceder a archivos temporales" ON storage.objects
  FOR ALL USING (bucket_id = 'temp' AND auth.role() = 'authenticated');

-- Función para limpiar archivos temporales antiguos (más de 24 horas)
CREATE OR REPLACE FUNCTION cleanup_temp_files()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects 
  WHERE bucket_id = 'temp' 
  AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener la URL pública de un archivo
CREATE OR REPLACE FUNCTION get_public_url(bucket_name text, file_path text)
RETURNS text AS $$
BEGIN
  RETURN 'https://' || current_setting('request.headers')::json->>'host' || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener la URL de descarga de un archivo
CREATE OR REPLACE FUNCTION get_download_url(bucket_name text, file_path text)
RETURNS text AS $$
BEGIN
  RETURN 'https://' || current_setting('request.headers')::json->>'host' || '/storage/v1/object/sign/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 