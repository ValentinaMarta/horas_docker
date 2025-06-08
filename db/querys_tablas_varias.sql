
-- Eliminar tablas de prueba si existen
DROP TABLE IF EXISTS empleados;
-- Ver tablas existentes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';
