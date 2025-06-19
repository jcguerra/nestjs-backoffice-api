#!/bin/bash

echo "🔐 Testing Login API - NestJS Backoffice"
echo "========================================"

# Configuración
DOCKER_PORT=3001
LOCAL_PORT=3000
API_VERSION="v1"

echo ""
echo "📋 Usuarios disponibles para prueba:"
echo "- admin@example.com (password: password123) - ADMIN"
echo "- user1@example.com (password: password123) - USER"
echo "- moderator1@example.com (password: password123) - MODERATOR"
echo ""

# Función para probar login
test_login() {
    local port=$1
    local environment=$2
    
    echo "🌐 Probando login en $environment (Puerto $port)..."
    echo "URL: http://localhost:$port/api/$API_VERSION/auth/login"
    echo ""
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST \
        "http://localhost:$port/api/$API_VERSION/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "admin@example.com",
            "password": "password123"
        }')
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
    
    echo "📊 Código de respuesta: $http_code"
    
    if [ $http_code -eq 200 ]; then
        echo "✅ Login exitoso!"
        echo "🎯 Respuesta:"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    else
        echo "❌ Login falló"
        echo "📝 Respuesta de error:"
        echo "$body"
    fi
    
    echo ""
    echo "----------------------------------------"
}

# Probar en Docker (puerto 3001)
test_login $DOCKER_PORT "Docker"

# Probar en Local (puerto 3000) - comentado por defecto
# echo "⚠️  Para probar en local, descomenta la siguiente línea:"
# test_login $LOCAL_PORT "Local"

echo ""
echo "🎯 CURL corregido para Swagger:"
echo "curl -X 'POST' \\"
echo "  'http://localhost:3001/api/v1/auth/login' \\"
echo "  -H 'accept: application/json' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "  \"email\": \"admin@example.com\","
echo "  \"password\": \"password123\""
echo "}'"
echo ""
echo "📚 Swagger UI: http://localhost:3001/api/docs"
echo "🔧 Adminer: http://localhost:8081" 