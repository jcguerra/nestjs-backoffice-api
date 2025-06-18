# NestJS Backoffice API

*[Read this in English](README.md)*

API robusta y escalable construida con NestJS, TypeORM, PostgreSQL y autenticación JWT.

## 🚀 Características

- ✅ **Docker & Docker Compose** - Entorno de desarrollo completo
- ✅ **TypeORM** - ORM robusto con migraciones y seeders
- ✅ **Autenticación JWT** - Sistema completo de login/registro
- ✅ **PostgreSQL** - Base de datos relacional
- ✅ **Redis** - Cache y sesiones
- ✅ **Validación** - DTOs con class-validator
- ✅ **Estructura escalable** - Arquitectura modular y mantenible
- ✅ **Guards y Decoradores** - Control de acceso por roles

## 📁 Estructura del Proyecto

```
src/
├── common/              # Código compartido
├── config/              # Configuraciones
├── database/            # Migraciones, seeders, factories
├── modules/
│   ├── auth/           # Autenticación JWT
│   ├── users/          # Gestión de usuarios
│   └── ...
├── app.module.ts
└── main.ts
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
cd nestjs-backoffice-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

#### 🔐 Generar JWT_SECRET
Para generar un JWT_SECRET seguro, ejecuta:
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('base64'))"
```

Copia el resultado y pégalo en tu archivo `.env`:
```bash
# Ejemplo de salida:
JWT_SECRET=R+7146wo/KXovaBVwNZaKeGxogSwsQ+Y5E9ntBUsfxhAlUOQvIK4I6MyJFNRGP72

# Otras variables importantes:
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nestjs_backoffice
JWT_EXPIRES_IN=24h
```

### 4. Ejecutar con Docker (Recomendado)
```bash
# Levantar todos los servicios
npm run docker:up

# Ver logs de la aplicación
npm run docker:logs

# Detener servicios
npm run docker:down
```

### 5. Ejecutar migraciones
```bash
# Ejecutar migraciones
npm run migration:run

# Ejecutar seeders
npm run seed:run
```

## 🐳 Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| API      | 3000   | Aplicación NestJS |
| PostgreSQL | 5432 | Base de datos |
| Redis    | 6379   | Cache |
| Adminer  | 8080   | Administrador de BD |

## 🔐 Autenticación

### Registro de usuario
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Obtener perfil (requiere token)
```bash
GET /auth/profile
Authorization: Bearer <tu-jwt-token>
```

## 👥 Gestión de Usuarios

### Listar usuarios
```bash
GET /users
GET /users?page=1&limit=10  # Paginado
```

### Crear usuario
```bash
POST /users
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "nuevo@example.com",
  "password": "password123",
  "firstName": "Nuevo",
  "lastName": "Usuario",
  "role": "user"
}
```

### Usuarios por rol
```bash
GET /users/role/admin
GET /users/active
```

## 🗄️ Base de Datos

### Migraciones
```bash
# Generar nueva migración
npm run migration:generate -- -n NombreMigracion

# Ejecutar migraciones
npm run migration:run

# Revertir última migración
npm run migration:revert
```

### Seeders
```bash
# Ejecutar todos los seeders
npm run seed:run
```

## 🛡️ Seguridad y Roles

### 🔐 Mejores Prácticas JWT
```bash
# Generar JWT_SECRET de diferentes formas:

# Opción 1: Base64 (recomendado - más compacto)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('base64'))"

# Opción 2: Hexadecimal (más largo pero válido)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Opción 3: Con OpenSSL
openssl rand -base64 48
```

**⚠️ Importante:**
- Nunca uses el mismo JWT_SECRET en desarrollo y producción
- Cambia el JWT_SECRET si sospechas que ha sido comprometido
- Mantén el JWT_SECRET fuera del control de versiones (usa `.env`)

### Decorador de Roles
```typescript
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Get('admin-only')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
async adminEndpoint() {
  return { message: 'Solo para administradores' };
}
```

### Guards Disponibles
- `JwtAuthGuard` - Verificar token JWT
- `RolesGuard` - Verificar roles de usuario
- `LocalAuthGuard` - Autenticación local

## 📊 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Modo desarrollo con watch
npm run start:debug        # Modo debug

# Producción
npm run build              # Compilar aplicación
npm run start:prod         # Ejecutar en producción

# Base de datos
npm run migration:run      # Ejecutar migraciones
npm run migration:revert   # Revertir migración
npm run seed:run          # Ejecutar seeders

# Docker
npm run docker:up         # Levantar contenedores
npm run docker:down       # Detener contenedores
npm run docker:logs       # Ver logs

# Testing
npm run test              # Tests unitarios
npm run test:e2e          # Tests end-to-end
npm run test:cov          # Coverage
```

## 🚀 Desarrollo

### Agregar nuevo módulo
```bash
# Crear estructura del módulo
mkdir -p src/modules/productos/{controllers,dto,entities,interfaces,repositories,services}

# Seguir el patrón establecido:
# 1. Crear entidad con TypeORM
# 2. Crear DTOs con validaciones
# 3. Crear interfaz de repositorio
# 4. Implementar repositorio
# 5. Crear servicio con lógica de negocio
# 6. Crear controlador
# 7. Registrar en módulo
```

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto de la aplicación | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de BD | `postgres` |
| `DB_PASSWORD` | Contraseña de BD | `postgres123` |
| `DB_NAME` | Nombre de la BD | `nestjs_backoffice` |
| `JWT_SECRET` | Secreto para JWT | `change-in-production` |
| `JWT_EXPIRES_IN` | Expiración del token | `1d` |

## 🔧 Tecnologías Utilizadas

- **Backend**: NestJS, TypeScript
- **Base de datos**: PostgreSQL, TypeORM
- **Autenticación**: JWT, Passport
- **Validación**: class-validator, class-transformer
- **Cache**: Redis
- **Contenedores**: Docker, Docker Compose
- **Testing**: Jest

## 📝 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
