-- Funciones SQL para el editor de Supabase
-- Este archivo contiene funciones útiles para el desarrollo

-- Función para obtener estadísticas de fotografías
CREATE OR REPLACE FUNCTION get_photography_stats()
RETURNS TABLE (
  total_photos INTEGER,
  available_photos INTEGER,
  sold_photos INTEGER,
  total_value DECIMAL(10,2),
  avg_price DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_photos,
    COUNT(*) FILTER (WHERE status = 'available')::INTEGER as available_photos,
    COUNT(*) FILTER (WHERE status = 'sold')::INTEGER as sold_photos,
    COALESCE(SUM(price), 0) as total_value,
    COALESCE(AVG(price), 0) as avg_price
  FROM photography;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para buscar fotografías por etiquetas
CREATE OR REPLACE FUNCTION search_photography_by_tags(search_tags TEXT[])
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  location TEXT,
  date DATE,
  tags TEXT[],
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.image_url,
    p.price,
    p.location,
    p.date,
    p.tags,
    p.status,
    p.created_at
  FROM photography p
  WHERE p.tags && search_tags
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener proyectos por tecnología
CREATE OR REPLACE FUNCTION get_projects_by_technology(tech TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  technologies TEXT[],
  role TEXT,
  status TEXT,
  external_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.image_url,
    p.start_date,
    p.end_date,
    p.technologies,
    p.role,
    p.status,
    p.external_links,
    p.created_at
  FROM projects p
  WHERE tech = ANY(p.technologies)
  ORDER BY p.start_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener contactos no leídos
CREATE OR REPLACE FUNCTION get_unread_contacts()
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.email,
    c.subject,
    c.message,
    c.status,
    c.created_at
  FROM contacts c
  WHERE c.status = 'new'
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para marcar contacto como leído
CREATE OR REPLACE FUNCTION mark_contact_as_read(contact_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE contacts 
  SET status = 'read', updated_at = NOW()
  WHERE id = contact_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener etiquetas populares
CREATE OR REPLACE FUNCTION get_popular_tags(category_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  name TEXT,
  category TEXT,
  usage_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.name,
    t.category,
    (
      (SELECT COUNT(*) FROM photography p WHERE t.name = ANY(p.tags)) +
      (SELECT COUNT(*) FROM projects pr WHERE t.name = ANY(pr.technologies))
    ) as usage_count
  FROM tags t
  WHERE (category_filter IS NULL OR t.category = category_filter)
  ORDER BY usage_count DESC, t.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- FUNCIONES DE STORAGE (COMPATIBLES)
-- ==========================================

-- Función para obtener estadísticas de storage
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS TABLE (
  bucket_name TEXT,
  total_files BIGINT,
  total_size BIGINT,
  avg_file_size BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bucket_id as bucket_name,
    COUNT(*) as total_files,
    COALESCE(SUM((metadata->>'size')::BIGINT), 0) as total_size,
    COALESCE(AVG((metadata->>'size')::BIGINT), 0) as avg_file_size
  FROM storage.objects
  GROUP BY bucket_id
  ORDER BY total_size DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener archivos por bucket
CREATE OR REPLACE FUNCTION get_files_by_bucket(bucket_name TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  bucket_id TEXT,
  owner UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  size BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.bucket_id,
    o.owner,
    o.created_at,
    o.updated_at,
    o.last_accessed_at,
    o.metadata,
    (o.metadata->>'size')::BIGINT as size
  FROM storage.objects o
  WHERE o.bucket_id = bucket_name
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener archivos grandes (> 5MB)
CREATE OR REPLACE FUNCTION get_large_files(size_limit BIGINT DEFAULT 5242880)
RETURNS TABLE (
  bucket_id TEXT,
  name TEXT,
  size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.bucket_id,
    o.name,
    (o.metadata->>'size')::BIGINT as size,
    o.created_at
  FROM storage.objects o
  WHERE (o.metadata->>'size')::BIGINT > size_limit
  ORDER BY (o.metadata->>'size')::BIGINT DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener archivos por tipo MIME
CREATE OR REPLACE FUNCTION get_files_by_mime_type(search_mime_type TEXT)
RETURNS TABLE (
  bucket_id TEXT,
  name TEXT,
  file_mime_type TEXT,
  size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.bucket_id,
    o.name,
    o.metadata->>'mimetype' as file_mime_type,
    (o.metadata->>'size')::BIGINT as size,
    o.created_at
  FROM storage.objects o
  WHERE o.metadata->>'mimetype' LIKE search_mime_type || '%'
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener archivos recientes
CREATE OR REPLACE FUNCTION get_recent_files(days_ago INTEGER DEFAULT 7)
RETURNS TABLE (
  bucket_id TEXT,
  name TEXT,
  size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.bucket_id,
    o.name,
    (o.metadata->>'size')::BIGINT as size,
    o.created_at
  FROM storage.objects o
  WHERE o.created_at > NOW() - INTERVAL '1 day' * days_ago
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener archivos huérfanos (sin referencia en la base de datos)
CREATE OR REPLACE FUNCTION get_orphaned_files()
RETURNS TABLE (
  bucket_id TEXT,
  name TEXT,
  size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.bucket_id,
    o.name,
    (o.metadata->>'size')::BIGINT as size,
    o.created_at
  FROM storage.objects o
  WHERE o.bucket_id = 'photography'
    AND NOT EXISTS (
      SELECT 1 FROM photography p 
      WHERE p.image_url LIKE '%' || o.name || '%'
    )
  UNION ALL
  SELECT 
    o.bucket_id,
    o.name,
    (o.metadata->>'size')::BIGINT as size,
    o.created_at
  FROM storage.objects o
  WHERE o.bucket_id = 'projects'
    AND NOT EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.image_url LIKE '%' || o.name || '%'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar archivos temporales antiguos
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