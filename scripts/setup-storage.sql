-- Script de configuración de Storage para Supabase
-- Ejecuta este script en el SQL Editor de Supabase

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

-- Mensaje de confirmación
SELECT 'Configuración de Storage completada exitosamente!' as status;
