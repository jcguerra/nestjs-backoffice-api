#!/bin/bash
set -e

# Script para crear múltiples bases de datos para testing
# Basado en la variable de entorno POSTGRES_MULTIPLE_DATABASES

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Creando bases de datos adicionales para testing..."
    
    # Separar las bases de datos por comas
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        echo "Creando base de datos: $db"
        
        # Crear la base de datos si no existe
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
            SELECT 'CREATE DATABASE $db'
            WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\gexec
EOSQL
        
        echo "Base de datos '$db' creada exitosamente"
        
        # Conectar a la nueva base de datos y crear extensiones
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$db" <<-EOSQL
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            \echo 'Extensiones creadas en base de datos $db'
EOSQL
    done
    
    echo "Todas las bases de datos de testing han sido creadas exitosamente"
else
    echo "POSTGRES_MULTIPLE_DATABASES no está definida. Solo se creará la base de datos principal."
fi 