-- Ejemplos de consultas para el Editor de Supabase
-- Copia y pega estas consultas en el SQL Editor de Supabase

-- ==========================================
-- CONSULTAS BÁSICAS
-- ==========================================

-- 1. Ver todas las fotografías disponibles
SELECT * FROM photography WHERE status = 'available' ORDER BY created_at DESC;

-- 2. Ver todos los proyectos completados
SELECT * FROM projects WHERE status = 'completed' ORDER BY start_date DESC;

-- 3. Ver contactos no leídos
SELECT * FROM contacts WHERE status = 'new' ORDER BY created_at DESC;

-- 4. Ver etiquetas más populares
SELECT * FROM tag_usage ORDER BY total_usage DESC;

-- ==========================================
-- ESTADÍSTICAS
-- ==========================================

-- 5. Estadísticas de fotografías
SELECT * FROM get_photography_stats();

-- 6. Dashboard de administración
SELECT * FROM admin_dashboard;

-- 7. Estadísticas de proyectos por estado
SELECT * FROM project_stats;

-- ==========================================
-- BÚSQUEDAS AVANZADAS
-- ==========================================

-- 8. Buscar fotografías por etiquetas
SELECT * FROM search_photography_by_tags(ARRAY['naturaleza', 'paisaje']);

-- 9. Proyectos que usan React
SELECT * FROM get_projects_by_technology('React');

-- 10. Fotografías con información de etiquetas
SELECT * FROM photography_with_tags WHERE status = 'available';

-- 11. Proyectos con información de tecnologías
SELECT * FROM projects_with_technologies WHERE status = 'in-progress';

-- ==========================================
-- GESTIÓN DE CONTENIDO
-- ==========================================

-- 12. Marcar un contacto como leído
-- SELECT mark_contact_as_read('UUID_DEL_CONTACTO');

-- 13. Ver contactos recientes (últimos 50)
SELECT * FROM recent_contacts;

-- 14. Fotografías vendidas con información completa
SELECT * FROM sold_photography;

-- ==========================================
-- CONSULTAS PERSONALIZADAS
-- ==========================================

-- 15. Proyectos con enlaces externos
SELECT 
  title,
  description,
  external_links->>'github' as github_url,
  external_links->>'live' as live_url
FROM projects 
WHERE external_links IS NOT NULL;

-- 16. Fotografías por rango de precio
SELECT 
  title,
  price,
  location,
  date
FROM photography 
WHERE price BETWEEN 100 AND 300
ORDER BY price DESC;

-- 17. Proyectos por duración
SELECT 
  title,
  start_date,
  end_date,
  CASE 
    WHEN end_date IS NULL THEN 'En progreso'
    ELSE 'Completado'
  END as status
FROM projects
ORDER BY start_date DESC;

-- 18. Etiquetas por categoría
SELECT 
  category,
  COUNT(*) as tag_count,
  array_agg(name) as tags
FROM tags 
GROUP BY category;

-- ==========================================
-- CONSULTAS DE MANTENIMIENTO
-- ==========================================

-- 19. Verificar integridad de datos
SELECT 
  'photography' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE image_url IS NULL) as missing_images
FROM photography
UNION ALL
SELECT 
  'projects' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE title IS NULL) as missing_titles
FROM projects;

-- 20. Limpiar etiquetas no utilizadas
-- DELETE FROM tags WHERE name NOT IN (
--   SELECT DISTINCT unnest(tags) FROM photography
--   UNION
--   SELECT DISTINCT unnest(technologies) FROM projects
-- );

-- ==========================================
-- CONSULTAS PARA REPORTES
-- ==========================================

-- 21. Reporte mensual de ventas
SELECT 
  DATE_TRUNC('month', updated_at) as month,
  COUNT(*) as photos_sold,
  SUM(price) as total_revenue
FROM photography 
WHERE status = 'sold'
GROUP BY DATE_TRUNC('month', updated_at)
ORDER BY month DESC;

-- 22. Tecnologías más utilizadas en proyectos
SELECT 
  unnest(technologies) as technology,
  COUNT(*) as usage_count
FROM projects
GROUP BY unnest(technologies)
ORDER BY usage_count DESC;

-- 23. Actividad reciente
SELECT 
  'photography' as type,
  title as name,
  created_at
FROM photography
WHERE created_at > NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'project' as type,
  title as name,
  created_at
FROM projects
WHERE created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- ==========================================
-- CONSULTAS DE STORAGE
-- ==========================================

-- 24. Ver todos los buckets de storage
SELECT * FROM storage.buckets;

-- 25. Estadísticas de storage por bucket
SELECT * FROM storage_bucket_stats;

-- 26. Dashboard de storage
SELECT * FROM storage_dashboard;

-- 27. Ver todos los archivos de storage
SELECT * FROM storage_files_overview LIMIT 50;

-- 28. Archivos de imágenes
SELECT * FROM image_files LIMIT 20;

-- 29. Archivos grandes (> 5MB)
SELECT * FROM large_files;

-- 30. Archivos recientes (últimos 7 días)
SELECT * FROM recent_files;

-- 31. Archivos por tipo MIME
SELECT * FROM files_by_mime_type;

-- 32. Archivos huérfanos (sin referencia en la base de datos)
SELECT * FROM orphaned_files;

-- 33. Estadísticas de storage usando función
SELECT * FROM get_storage_stats();

-- 34. Archivos en bucket específico
SELECT * FROM get_files_by_bucket('photography');

-- 35. Archivos grandes usando función
SELECT * FROM get_large_files(10485760); -- 10MB

-- 36. Archivos por tipo MIME usando función
SELECT * FROM get_files_by_mime_type('image');

-- 37. Archivos recientes usando función
SELECT * FROM get_recent_files(30); -- últimos 30 días

-- 38. Archivos huérfanos usando función
SELECT * FROM get_orphaned_files();

-- ==========================================
-- CONSULTAS DE MANTENIMIENTO DE STORAGE
-- ==========================================

-- 39. Limpiar archivos temporales antiguos
-- SELECT cleanup_temp_files();

-- 40. Verificar archivos sin metadata
SELECT 
  id,
  name,
  bucket_id,
  created_at
FROM storage.objects 
WHERE metadata IS NULL OR metadata = '{}';

-- 41. Verificar archivos con nombres duplicados
SELECT 
  name,
  bucket_id,
  COUNT(*) as duplicate_count
FROM storage.objects 
GROUP BY name, bucket_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 42. Verificar archivos con tamaños anómalos (0 bytes o muy grandes)
SELECT 
  id,
  name,
  bucket_id,
  (metadata->>'size')::BIGINT as size_bytes,
  created_at
FROM storage.objects 
WHERE (metadata->>'size')::BIGINT = 0 
   OR (metadata->>'size')::BIGINT > 52428800 -- 50MB
ORDER BY (metadata->>'size')::BIGINT DESC;

-- 43. Verificar archivos por bucket y tipo MIME
SELECT 
  bucket_id,
  metadata->>'mimetype' as mime_type,
  COUNT(*) as file_count,
  ROUND(SUM((metadata->>'size')::BIGINT) / 1024.0 / 1024.0, 2) as total_size_mb
FROM storage.objects 
GROUP BY bucket_id, metadata->>'mimetype'
ORDER BY bucket_id, file_count DESC;

-- ==========================================
-- CONSULTAS DE SEGURIDAD DE STORAGE
-- ==========================================

-- 44. Verificar políticas de storage
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 45. Verificar permisos de buckets
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
ORDER BY id;

-- 46. Verificar archivos por propietario
SELECT 
  owner,
  bucket_id,
  COUNT(*) as file_count,
  ROUND(SUM((metadata->>'size')::BIGINT) / 1024.0 / 1024.0, 2) as total_size_mb
FROM storage.objects 
WHERE owner IS NOT NULL
GROUP BY owner, bucket_id
ORDER BY total_size_mb DESC; 