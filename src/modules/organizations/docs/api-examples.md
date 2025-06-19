# API Organizations - Ejemplos de Uso

## Índice
1. [Autenticación](#autenticación)
2. [Gestión de Organizaciones](#gestión-de-organizaciones)
3. [Gestión de Propietarios](#gestión-de-propietarios)
4. [Casos de Uso Comunes](#casos-de-uso-comunes)
5. [Manejo de Errores](#manejo-de-errores)

## Autenticación

Todos los endpoints requieren autenticación JWT. Primero obtén un token:

```bash
# Login para obtener token (Docker - Puerto 3001)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Login para obtener token (Local - Puerto 3000)  
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@ejemplo.com",
    "firstName": "Admin",
    "lastName": "Usuario"
  }
}
```

Usa el token en todos los requests:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Gestión de Organizaciones

### 1. Crear Organización

```bash
# Docker (Puerto 3001)
curl -X POST http://localhost:3001/api/v1/organizations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "description": "Una empresa dedicada a soluciones tecnológicas innovadoras",
    "ownerIds": ["987e6543-e21c-98d7-b654-321987654321"]
  }'

# Local (Puerto 3000)
curl -X POST http://localhost:3000/api/v1/organizations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "description": "Una empresa dedicada a soluciones tecnológicas innovadoras",
    "ownerIds": ["987e6543-e21c-98d7-b654-321987654321"]
  }'
```

**Respuesta exitosa (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Acme Corporation",
  "description": "Una empresa dedicada a soluciones tecnológicas innovadoras",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Organizaciones (Con Paginación)

```bash
curl -X GET "http://localhost:3000/api/organizations?page=1&limit=10&includeOwners=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Acme Corporation",
      "description": "Una empresa dedicada a soluciones tecnológicas",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### 3. Obtener Organización por ID

```bash
curl -X GET "http://localhost:3000/api/organizations/123e4567-e89b-12d3-a456-426614174000?includeOwners=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Actualizar Organización

```bash
curl -X PATCH http://localhost:3000/api/organizations/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation Ltd",
    "description": "Empresa líder en soluciones tecnológicas"
  }'
```

### 5. Eliminar Organización

```bash
curl -X DELETE http://localhost:3000/api/organizations/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Gestión de Propietarios

### 1. Obtener Propietarios de Organización

```bash
curl -X GET "http://localhost:3000/api/organizations/123e4567-e89b-12d3-a456-426614174000/owners?activeOnly=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta:**
```json
[
  {
    "userId": "987e6543-e21c-98d7-b654-321987654321",
    "email": "propietario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "OWNER",
    "assignedAt": "2024-01-10T09:00:00.000Z",
    "assignedBy": "456e7890-a12b-34c5-d678-901234567890",
    "isActive": true
  }
]
```

### 2. Agregar Propietarios

```bash
curl -X POST http://localhost:3000/api/organizations/123e4567-e89b-12d3-a456-426614174000/owners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["456e7890-a12b-34c5-d678-901234567890", "789e1234-b56c-78d9-e012-345678901234"],
    "role": "ADMIN"
  }'
```

### 3. Actualizar Rol de Propietario

```bash
curl -X PATCH http://localhost:3000/api/organizations/123e4567-e89b-12d3-a456-426614174000/owners/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "456e7890-a12b-34c5-d678-901234567890",
    "newRole": "MEMBER"
  }'
```

### 4. Remover Propietarios

```bash
curl -X DELETE http://localhost:3000/api/organizations/123e4567-e89b-12d3-a456-426614174000/owners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["456e7890-a12b-34c5-d678-901234567890"]
  }'
```

## Casos de Uso Comunes

### Caso 1: Setup Inicial de Organización Multi-Tenant

```bash
# 1. Crear organización con propietario inicial
curl -X POST http://localhost:3000/api/organizations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Startup Tech Solutions",
    "description": "Startup enfocada en IA y blockchain",
    "ownerIds": ["founder-uuid-here"]
  }'

# 2. Agregar equipo de administradores
curl -X POST http://localhost:3000/api/organizations/NEW_ORG_ID/owners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["cto-uuid", "coo-uuid"],
    "role": "ADMIN"
  }'

# 3. Agregar empleados con permisos básicos
curl -X POST http://localhost:3000/api/organizations/NEW_ORG_ID/owners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["employee1-uuid", "employee2-uuid", "employee3-uuid"],
    "role": "MEMBER"
  }'
```

### Caso 2: Migración de Roles en Organización

```bash
# 1. Obtener propietarios actuales por rol
curl -X GET "http://localhost:3000/api/organizations/ORG_ID/owners/by-role/ADMIN" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Promover miembro a administrador
curl -X PATCH http://localhost:3000/api/organizations/ORG_ID/owners/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "member-to-promote-uuid",
    "newRole": "ADMIN"
  }'

# 3. Degradar administrador a miembro
curl -X PATCH http://localhost:3000/api/organizations/ORG_ID/owners/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin-to-demote-uuid",
    "newRole": "MEMBER"
  }'
```

### Caso 3: Auditoria de Organizaciones

```bash
# 1. Obtener todas las organizaciones con propietarios
curl -X GET "http://localhost:3000/api/organizations?includeOwners=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Filtrar organizaciones por propietario específico
curl -X GET "http://localhost:3000/api/organizations/by-owner/USER_UUID?includeOwners=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Obtener solo organizaciones activas
curl -X GET "http://localhost:3000/api/organizations/active?includeOwners=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Manejo de Errores

### Error 400 - Bad Request
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    "El nombre es requerido",
    "Cada ID de usuario debe ser un UUID válido"
  ]
}
```

### Error 401 - Unauthorized
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Token de autenticación requerido"
}
```

### Error 404 - Not Found
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Organización no encontrada"
}
```

### Error 409 - Conflict (Nombre duplicado)
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Ya existe una organización con ese nombre"
}
```

## Códigos de Respuesta

| Código | Descripción | Casos |
|--------|-------------|-------|
| 200 | OK | GET exitoso, UPDATE exitoso |
| 201 | Created | POST exitoso |
| 400 | Bad Request | Validación fallida, datos inválidos |
| 401 | Unauthorized | Token faltante o inválido |
| 403 | Forbidden | Sin permisos para la acción |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Nombre duplicado, usuario ya es propietario |
| 500 | Internal Server Error | Error del servidor |

## Límites y Restricciones

### Paginación
- **Máximo por página**: 100 elementos
- **Página mínima**: 1
- **Límite por defecto**: 10 elementos

### Propietarios
- **Máximo agregar simultáneo**: 10 propietarios
- **Máximo remover simultáneo**: 10 propietarios
- **Restricción**: No se puede remover el último propietario OWNER

### Nombres de Organización
- **Longitud mínima**: 2 caracteres
- **Longitud máxima**: 100 caracteres
- **Restricción**: Debe ser único en el sistema

### Descripción
- **Longitud máxima**: 500 caracteres
- **Opcional**: Puede ser null 