-- Datos iniciales para la base de datos
-- Este archivo se ejecuta después de las migraciones

-- Insertar etiquetas de ejemplo
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
('Supabase', 'project'),
('JavaScript', 'project'),
('Python', 'project'),
('Docker', 'project'),
('Git', 'project')
ON CONFLICT (name) DO NOTHING;

-- Insertar proyectos de ejemplo
INSERT INTO projects (title, description, start_date, technologies, role, status, external_links) VALUES
(
  'Mi Plantilla Web',
  'Plantilla web personal desarrollada con Astro y Supabase, incluyendo secciones de fotografía, proyectos y contacto.',
  '2024-01-01',
  ARRAY['Astro', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  'Desarrollador Full Stack',
  'completed',
  '{"github": "https://github.com/tu-usuario/mi-plantilla-web", "live": "https://tu-dominio.com"}'
),
(
  'Sistema de Gestión de Contenido',
  'CMS personalizado para gestionar fotografías y proyectos con panel de administración.',
  '2024-02-01',
  ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  'Desarrollador Frontend',
  'in-progress',
  '{"github": "https://github.com/tu-usuario/cms-project"}'
),
(
  'Portfolio Fotográfico',
  'Galería de fotografías con sistema de etiquetas y filtros avanzados.',
  '2024-03-01',
  ARRAY['Astro', 'TypeScript', 'Supabase'],
  'Desarrollador Full Stack',
  'planned',
  '{}'
)
ON CONFLICT DO NOTHING;

-- Insertar fotografías de ejemplo
INSERT INTO photography (title, description, image_url, price, location, date, tags, status) VALUES
(
  'Paisaje Montañoso',
  'Hermoso paisaje de montañas al atardecer',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  150.00,
  'Pirineos, España',
  '2024-01-15',
  ARRAY['naturaleza', 'paisaje'],
  'available'
),
(
  'Arquitectura Urbana',
  'Edificios modernos en el centro de la ciudad',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  200.00,
  'Barcelona, España',
  '2024-02-10',
  ARRAY['urbano', 'arquitectura'],
  'available'
),
(
  'Retrato en Blanco y Negro',
  'Retrato artístico en blanco y negro',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  120.00,
  'Madrid, España',
  '2024-03-05',
  ARRAY['retrato'],
  'sold'
)
ON CONFLICT DO NOTHING; 