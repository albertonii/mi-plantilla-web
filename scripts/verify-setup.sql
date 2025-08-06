-- Script de verificación de configuración de Supabase
-- Ejecuta este script para verificar que todo está configurado correctamente

-- Verificar tablas
SELECT 
  'Tablas creadas:' as check_type,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'photography', 'projects', 'tags', 'contacts');

-- Verificar políticas RLS
SELECT 
  'Políticas RLS:' as check_type,
  COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'photography', 'projects', 'tags', 'contacts');

-- Verificar triggers
SELECT 
  'Triggers:' as check_type,
  COUNT(*) as count
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table IN ('profiles', 'photography', 'projects', 'contacts');

-- Verificar etiquetas de ejemplo
SELECT 
  'Etiquetas de ejemplo:' as check_type,
  COUNT(*) as count
FROM tags;

-- Verificar buckets de storage (esto requiere permisos especiales)
-- SELECT 
--   'Buckets de storage:' as check_type,
--   COUNT(*) as count
-- FROM storage.buckets 
-- WHERE name IN ('avatars', 'photography', 'projects');

-- Resumen de configuración
SELECT 
  'RESUMEN DE CONFIGURACIÓN' as summary,
  '✅ Tablas: ' || (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'photography', 'projects', 'tags', 'contacts')) ||
  ' | ✅ Políticas: ' || (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('profiles', 'photography', 'projects', 'tags', 'contacts')) ||
  ' | ✅ Triggers: ' || (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public' AND event_object_table IN ('profiles', 'photography', 'projects', 'contacts')) ||
  ' | ✅ Etiquetas: ' || (SELECT COUNT(*) FROM tags) as status;
