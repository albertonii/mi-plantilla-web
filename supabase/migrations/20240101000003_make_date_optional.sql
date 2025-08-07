-- Migración para hacer la fecha opcional en la tabla de fotografías
-- Fecha: 2024-01-01

-- Hacer la columna date opcional en la tabla photography
ALTER TABLE photography ALTER COLUMN date DROP NOT NULL;

-- Comentario sobre el cambio
COMMENT ON COLUMN photography.date IS 'Fecha opcional de la fotografía. Puede ser NULL si no se especifica.'; 