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
- ✅ **Documentación Swagger** - API documentada automáticamente
- ✅ **Principios SOLID** - Arquitectura robusta y mantenible
- ✅ **Inyección de Dependencias** - Abstracciones basadas en interfaces
- ✅ **Estructura escalable** - Arquitectura modular y mantenible
- ✅ **Guards y Decoradores** - Control de acceso por roles

## 📁 Estructura del Proyecto

```
src/
├── common/              # Código compartido
│   ├── decorators/     # Decoradores personalizados
│   ├── dto/           # DTOs comunes
│   ├── enums/         # Enumeraciones
│   ├── guards/        # Guards de autenticación
│   └── interfaces/    # Interfaces base
├── config/              # Configuraciones
├── database/            # Migraciones, seeders, factories
├── modules/
│   ├── auth/           # Autenticación JWT
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── interfaces/
│   │   ├── services/
│   │   ├── strategies/
│   │   └── tests/
│   ├── users/          # Gestión de usuarios (Arquitectura SOLID)
│   │   ├── controllers/    # Capa HTTP
│   │   ├── dto/           # Objetos de Transferencia de Datos
│   │   ├── entities/      # Entidades de base de datos
│   │   ├── interfaces/    # Interfaces de servicio y respuesta
│   │   ├── mappers/       # Transformación de datos
│   │   ├── repositories/  # Capa de acceso a datos
│   │   ├── services/      # Lógica de negocio
│   │   └── tests/         # Tests unitarios e integración
│   └── ...
├── app.module.ts
└── main.ts
```

## 🏗️ Arquitectura y Principios SOLID

Este proyecto sigue los **principios SOLID** para un código mantenible y robusto:

### 🎯 Implementación SOLID

- **Principio de Responsabilidad Única (SRP)**
  - Los controladores manejan solo peticiones HTTP
  - Los servicios contienen solo lógica de negocio
  - Los mappers manejan solo transformación de datos

- **Principio Abierto/Cerrado (OCP)**
  - Extensible a través de interfaces
  - Nuevas características sin modificar código existente

- **Principio de Sustitución de Liskov (LSP)**
  - Las implementaciones de interfaces son intercambiables
  - Comportamiento consistente entre implementaciones

- **Principio de Segregación de Interfaces (ISP)**
  - Interfaces específicas para diferentes operaciones
  - Sin dependencias innecesarias

- **Principio de Inversión de Dependencias (DIP)**
  - Los controladores dependen de interfaces de servicio
  - Los servicios dependen de interfaces de repositorio
  - Abstracciones sobre implementaciones concretas

### 📋 Arquitectura por Capas

```
Petición HTTP
     ↓
🌐 Controlador (Capa HTTP)
     ↓
🔄 Mapper (Transformación de datos)
     ↓
⚙️  Interfaz de Servicio (Lógica de negocio)
     ↓
📊 Interfaz de Repositorio (Acceso a datos)
     ↓
🗄️  Base de Datos
```

### 🧩 Inyección de Dependencias

```typescript
// Ejemplo: Controlador usando interfaz de servicio
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUsersService')
    private readonly usersService: IUsersService
  ) {}
}

// Ejemplo: Servicio usando interfaz de repositorio
export class UsersService implements IUsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}
}
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/jcguerra/nestjs-backoffice-api
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

## 📚 Documentación Swagger

La API cuenta con documentación interactiva generada automáticamente con Swagger/OpenAPI.

### 🌐 Acceso a la Documentación

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación en:

**URL**: `http://localhost:3000/api/docs`

### 🔍 Características de Swagger

- **Documentación Automática** - Todos los endpoints están documentados
- **Autenticación JWT** - Soporte completo para tokens Bearer
- **Esquemas de DTOs** - Documentación de todos los modelos de datos
- **Pruebas Interactivas** - Ejecuta endpoints directamente desde la interfaz
- **Ejemplos de Respuestas** - Formato esperado para cada endpoint
- **Validaciones** - Descripción de reglas de validación

### 🔑 Autenticación en Swagger

Para probar endpoints protegidos:

1. Ejecuta el endpoint `/auth/login` desde Swagger
2. Copia el token JWT de la respuesta
3. Haz clic en el botón **"Authorize"** en la parte superior
4. Ingresa: `Bearer <tu-token-jwt>`
5. Ahora puedes probar todos los endpoints protegidos

### 📋 Tags Disponibles

- **auth** - Endpoints de autenticación (login, registro, perfil)
- **users** - Endpoints de gestión de usuarios

### 🎯 Ejemplos de Uso

**Desde Swagger UI:**
1. Navega a `http://localhost:3000/api/docs`
2. Explora los endpoints disponibles
3. Prueba la funcionalidad directamente

**Desde línea de comandos:**
```bash
# Obtener documentación en formato JSON
curl http://localhost:3000/api/docs-json

# Obtener documentación en formato YAML
curl http://localhost:3000/api/docs-yaml
```

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

## 🧪 Testing

Configuración completa de testing con tests unitarios, de integración y end-to-end usando Jest y bases de datos dedicadas para testing.

### Comandos de Testing

```bash
# Tests Unitarios
npm run test:unit          # Ejecutar solo tests unitarios
npm run test:watch         # Modo watch para desarrollo
npm run test:debug         # Modo debug

# Tests de Integración y E2E
npm run test:integration   # Ejecutar tests de integración
npm run test:e2e          # Ejecutar tests end-to-end
npm run test:e2e:full     # E2E con configuración/limpieza de BD

# Coverage y Análisis
npm run test:cov          # Generar reporte de coverage
npm run test:all          # Ejecutar todos los tests (unit + integration + e2e)

# Gestión de Base de Datos de Testing
npm run test:db:setup     # Levantar contenedor de BD de testing
npm run test:db:teardown  # Detener contenedor de BD de testing
npm run test:db:reset     # Reiniciar BD de testing
```

### Estructura de Tests

```
src/
├── modules/
│   ├── auth/
│   │   └── tests/
│   │       └── auth.service.spec.ts
│   └── users/
│       └── tests/
│           ├── user.mapper.spec.ts      # Tests de transformación de datos
│           ├── users.controller.spec.ts # Tests de capa HTTP
│           └── users.service.spec.ts    # Tests de lógica de negocio
└── test-utils/
    └── database-test.utils.ts

test/
├── app.e2e-spec.ts
├── auth.e2e-spec.ts
├── jest-e2e.json
└── setup-e2e.ts
```

### Bases de Datos de Testing

| Base de Datos | Propósito | Puerto |
|---------------|-----------|--------|
| `nestjs_backoffice_test` | Tests unitarios y de integración | 5434 |
| `nestjs_backoffice_test_e2e` | Tests end-to-end | 5434 |

### Objetivos de Coverage

| Componente | Coverage Objetivo | Principio SOLID |
|------------|------------------|-----------------|
| Servicios | 90%+ | SRP - Lógica de negocio |
| Controladores | 85%+ | SRP - Manejo HTTP |
| Mappers | 95%+ | SRP - Transformación de datos |
| Interfaces | 100% | ISP/DIP - Contratos |
| Guards/Pipes | 95%+ | SRP - Validación |
| Flujos E2E | Journeys clave de usuario | Integración |

### Ejecutando Tests

```bash
# Ejecución rápida (solo tests unitarios)
npm run test:unit

# Suite completa con coverage
npm run test:cov

# Flujo de desarrollo
npm run test:watch

# Antes de hacer deploy
npm run test:all
```

### Configuración de Testing

- **Framework**: Jest con soporte TypeScript
- **Base de datos**: Contenedores PostgreSQL de testing
- **Mocking**: Mocks de capa de servicio para tests unitarios
- **E2E**: Integración real con base de datos
- **Coverage**: Umbral: 80% (líneas, funciones, branches)

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
