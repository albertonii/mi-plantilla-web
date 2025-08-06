-- Vistas SQL para consultas comunes
-- Este archivo contiene vistas útiles para el desarrollo

-- Vista para fotografías con información completa
CREATE OR REPLACE VIEW photography_with_tags AS
SELECT 
  p.*,
  array_agg(DISTINCT t.name) FILTER (WHERE t.category = 'photography') as tag_names
FROM photography p
LEFT JOIN tags t ON t.name = ANY(p.tags)
GROUP BY p.id, p.title, p.description, p.image_url, p.price, p.location, p.date, p.tags, p.status, p.created_at, p.updated_at;

-- Vista para proyectos con información completa
CREATE OR REPLACE VIEW projects_with_technologies AS
SELECT 
  pr.*,
  array_agg(DISTINCT t.name) FILTER (WHERE t.category = 'project') as technology_names
FROM projects pr
LEFT JOIN tags t ON t.name = ANY(pr.technologies)
GROUP BY pr.id, pr.title, pr.description, pr.image_url, pr.start_date, pr.end_date, pr.technologies, pr.role, pr.status, pr.external_links, pr.created_at, pr.updated_at;

-- Vista para estadísticas de proyectos
CREATE OR REPLACE VIEW project_stats AS
SELECT 
  status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE end_date IS NOT NULL) as completed_count,
  COUNT(*) FILTER (WHERE end_date IS NULL) as ongoing_count
FROM projects
GROUP BY status;

-- Vista para fotografías disponibles
CREATE OR REPLACE VIEW available_photography AS
SELECT *
FROM photography
WHERE status = 'available'
ORDER BY created_at DESC;

-- Vista para fotografías vendidas
CREATE OR REPLACE VIEW sold_photography AS
SELECT *
FROM photography
WHERE status = 'sold'
ORDER BY updated_at DESC;

-- Vista para contactos recientes
CREATE OR REPLACE VIEW recent_contacts AS
SELECT *
FROM contacts
ORDER BY created_at DESC
LIMIT 50;

-- Vista para etiquetas con conteo de uso
CREATE OR REPLACE VIEW tag_usage AS
SELECT 
  t.name,
  t.category,
  (SELECT COUNT(*) FROM photography p WHERE t.name = ANY(p.tags)) as photography_count,
  (SELECT COUNT(*) FROM projects pr WHERE t.name = ANY(pr.technologies)) as project_count,
  (SELECT COUNT(*) FROM photography p WHERE t.name = ANY(p.tags)) + 
  (SELECT COUNT(*) FROM projects pr WHERE t.name = ANY(pr.technologies)) as total_usage
FROM tags t
ORDER BY total_usage DESC, t.name;

-- Vista para dashboard de administración
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
  (SELECT COUNT(*) FROM photography) as total_photos,
  (SELECT COUNT(*) FROM photography WHERE status = 'available') as available_photos,
  (SELECT COUNT(*) FROM photography WHERE status = 'sold') as sold_photos,
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM projects WHERE status = 'completed') as completed_projects,
  (SELECT COUNT(*) FROM projects WHERE status = 'in-progress') as in_progress_projects,
  (SELECT COUNT(*) FROM contacts WHERE status = 'new') as unread_contacts,
  (SELECT COUNT(*) FROM contacts) as total_contacts,
  (SELECT COALESCE(SUM(price), 0) FROM photography WHERE status = 'sold') as total_sales,
  (SELECT COALESCE(AVG(price), 0) FROM photography WHERE status = 'available') as avg_photo_price;

-- ==========================================
-- VISTAS DE STORAGE
-- ==========================================

-- Vista para archivos de storage con información completa
CREATE OR REPLACE VIEW storage_files_overview AS
SELECT 
  o.id,
  o.name,
  o.bucket_id,
  o.owner,
  o.created_at,
  o.updated_at,
  o.last_accessed_at,
  (o.metadata->>'size')::BIGINT as size_bytes,
  ROUND((o.metadata->>'size')::BIGINT / 1024.0, 2) as size_kb,
  ROUND((o.metadata->>'size')::BIGINT / 1024.0 / 1024.0, 2) as size_mb,
  o.metadata->>'mimetype' as mime_type,
  o.metadata->>'etag' as etag,
  CASE 
    WHEN o.bucket_id = 'photography' THEN 'Fotografía'
    WHEN o.bucket_id = 'avatars' THEN 'Avatar'
    WHEN o.bucket_id = 'projects' THEN 'Proyecto'
    WHEN o.bucket_id = 'temp' THEN 'Temporal'
    ELSE 'Otro'
  END as bucket_type
FROM storage.objects o
ORDER BY o.created_at DESC;

-- Vista para estadísticas de storage por bucket
CREATE OR REPLACE VIEW storage_bucket_stats AS
SELECT 
  bucket_id,
  COUNT(*) as total_files,
  COALESCE(SUM((metadata->>'size')::BIGINT), 0) as total_size_bytes,
  ROUND(COALESCE(SUM((metadata->>'size')::BIGINT), 0) / 1024.0 / 1024.0, 2) as total_size_mb,
  COALESCE(AVG((metadata->>'size')::BIGINT), 0) as avg_file_size_bytes,
  ROUND(COALESCE(AVG((metadata->>'size')::BIGINT), 0) / 1024.0, 2) as avg_file_size_kb,
  MIN(created_at) as oldest_file,
  MAX(created_at) as newest_file
FROM storage.objects
GROUP BY bucket_id
ORDER BY total_size_bytes DESC;

-- Vista para archivos de imágenes
CREATE OR REPLACE VIEW image_files AS
SELECT 
  o.id,
  o.name,
  o.bucket_id,
  o.created_at,
  (o.metadata->>'size')::BIGINT as size_bytes,
  ROUND((o.metadata->>'size')::BIGINT / 1024.0 / 1024.0, 2) as size_mb,
  o.metadata->>'mimetype' as mime_type,
  o.metadata->>'etag' as etag
FROM storage.objects o
WHERE o.metadata->>'mimetype' LIKE 'image/%'
ORDER BY o.created_at DESC;

-- Vista para archivos grandes (> 5MB)
CREATE OR REPLACE VIEW large_files AS
SELECT 
  o.id,
  o.name,
  o.bucket_id,
  o.created_at,
  (o.metadata->>'size')::BIGINT as size_bytes,
  ROUND((o.metadata->>'size')::BIGINT / 1024.0 / 1024.0, 2) as size_mb,
  o.metadata->>'mimetype' as mime_type
FROM storage.objects o
WHERE (o.metadata->>'size')::BIGINT > 5242880 -- 5MB
ORDER BY (o.metadata->>'size')::BIGINT DESC;

-- Vista para archivos recientes (últimos 7 días)
CREATE OR REPLACE VIEW recent_files AS
SELECT 
  o.id,
  o.name,
  o.bucket_id,
  o.created_at,
  (o.metadata->>'size')::BIGINT as size_bytes,
  ROUND((o.metadata->>'size')::BIGINT / 1024.0, 2) as size_kb,
  o.metadata->>'mimetype' as mime_type
FROM storage.objects o
WHERE o.created_at > NOW() - INTERVAL '7 days'
ORDER BY o.created_at DESC;

-- Vista para archivos por tipo MIME
CREATE OR REPLACE VIEW files_by_mime_type AS
SELECT 
  o.metadata->>'mimetype' as mime_type,
  COUNT(*) as file_count,
  COALESCE(SUM((o.metadata->>'size')::BIGINT), 0) as total_size_bytes,
  ROUND(COALESCE(SUM((o.metadata->>'size')::BIGINT), 0) / 1024.0 / 1024.0, 2) as total_size_mb,
  AVG((o.metadata->>'size')::BIGINT) as avg_size_bytes
FROM storage.objects o
GROUP BY o.metadata->>'mimetype'
ORDER BY file_count DESC;

-- Vista para archivos huérfanos (sin referencia en la base de datos)
CREATE OR REPLACE VIEW orphaned_files AS
SELECT 
  o.bucket_id,
  o.name,
  o.created_at,
  (o.metadata->>'size')::BIGINT as size_bytes,
  ROUND((o.metadata->>'size')::BIGINT / 1024.0 / 1024.0, 2) as size_mb
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
  o.created_at,
  (o.metadata->>'size')::BIGINT as size_bytes,
  ROUND((o.metadata->>'size')::BIGINT / 1024.0 / 1024.0, 2) as size_mb
FROM storage.objects o
WHERE o.bucket_id = 'projects'
  AND NOT EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.image_url LIKE '%' || o.name || '%'
  );

-- Vista para dashboard de storage
CREATE OR REPLACE VIEW storage_dashboard AS
SELECT 
  (SELECT COUNT(*) FROM storage.objects) as total_files,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'photography') as photography_files,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'avatars') as avatar_files,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'projects') as project_files,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'temp') as temp_files,
  (SELECT COALESCE(SUM((metadata->>'size')::BIGINT), 0) FROM storage.objects) as total_size_bytes,
  ROUND((SELECT COALESCE(SUM((metadata->>'size')::BIGINT), 0) FROM storage.objects) / 1024.0 / 1024.0, 2) as total_size_mb,
  (SELECT COUNT(*) FROM storage.objects WHERE created_at > NOW() - INTERVAL '24 hours') as files_last_24h,
  (SELECT COUNT(*) FROM storage.objects WHERE (metadata->>'size')::BIGINT > 5242880) as large_files_count; 