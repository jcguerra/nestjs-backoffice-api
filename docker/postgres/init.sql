-- Script de inicialización para PostgreSQL
-- Se ejecuta automáticamente cuando se crea el contenedor

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear esquemas si necesitas separar datos
-- CREATE SCHEMA IF NOT EXISTS app;
-- CREATE SCHEMA IF NOT EXISTS auth;

-- Configuraciones adicionales
-- SET timezone = 'UTC'; 