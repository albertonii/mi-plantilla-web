-- Funciones SQL para el editor de Supabase (Solo Base de Datos)
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