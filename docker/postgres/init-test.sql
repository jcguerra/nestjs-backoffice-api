-- Configuración inicial para PostgreSQL en ambiente de testing

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Configuraciones específicas para testing
ALTER SYSTEM SET log_statement = 'none';
ALTER SYSTEM SET log_min_duration_statement = -1;
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';

-- Recargar configuración
SELECT pg_reload_conf();

-- Mensaje de confirmación
\echo 'PostgreSQL configurado para ambiente de testing'; 