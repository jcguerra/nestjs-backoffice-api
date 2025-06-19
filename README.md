# NestJS Backoffice API

*[Leer en Español](README.es.md)*

Robust and scalable API built with NestJS, TypeORM, PostgreSQL and JWT authentication.

## 🚀 Features

- ✅ **Docker & Docker Compose** - Complete development environment
- ✅ **TypeORM** - Robust ORM with migrations and seeders
- ✅ **JWT Authentication** - Complete login/register system
- ✅ **PostgreSQL** - Relational database
- ✅ **Redis** - Cache and sessions
- ✅ **Validation** - DTOs with class-validator
- ✅ **Scalable structure** - Modular and maintainable architecture
- ✅ **Guards and Decorators** - Role-based access control

## 📁 Project Structure

```
src/
├── common/              # Shared code
├── config/              # Configurations
├── database/            # Migrations, seeders, factories
├── modules/
│   ├── auth/           # JWT Authentication
│   ├── users/          # User management
│   └── ...
├── app.module.ts
└── main.ts
```

## 🛠️ Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/jcguerra/nestjs-backoffice-api
cd nestjs-backoffice-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

#### 🔐 Generate JWT_SECRET
To generate a secure JWT_SECRET, run:
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('base64'))"
```

Copy the result and paste it into your `.env` file:
```bash
# Example output:
JWT_SECRET=R+7146wo/KXovaBVwNZaKeGxogSwsQ+Y5E9ntBUsfxhAlUOQvIK4I6MyJFNRGP72

# Other important variables:
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nestjs_backoffice
JWT_EXPIRES_IN=24h
```

### 4. Run with Docker (Recommended)
```bash
# Start all services
npm run docker:up

# View application logs
npm run docker:logs

# Stop services
npm run docker:down
```

### 5. Run migrations
```bash
# Run migrations
npm run migration:run

# Run seeders
npm run seed:run
```

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| API     | 3000 | NestJS Application |
| PostgreSQL | 5432 | Database |
| Redis   | 6379 | Cache |
| Adminer | 8080 | Database Admin |

## 🔐 Authentication

### User registration
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get profile (requires token)
```bash
GET /auth/profile
Authorization: Bearer <your-jwt-token>
```

## 👥 User Management

### List users
```bash
GET /users
GET /users?page=1&limit=10  # Paginated
```

### Create user
```bash
POST /users
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "new@example.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "role": "user"
}
```

### Users by role
```bash
GET /users/role/admin
GET /users/active
```

## 🗄️ Database

### Migrations
```bash
# Generate new migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Seeders
```bash
# Run all seeders
npm run seed:run
```

## 🛡️ Security and Roles

### 🔐 JWT Best Practices
```bash
# Generate JWT_SECRET in different ways:

# Option 1: Base64 (recommended - more compact)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('base64'))"

# Option 2: Hexadecimal (longer but valid)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Option 3: With OpenSSL
openssl rand -base64 48
```

**⚠️ Important:**
- Never use the same JWT_SECRET in development and production
- Change JWT_SECRET if you suspect it has been compromised
- Keep JWT_SECRET out of version control (use `.env`)

### Roles Decorator
```typescript
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Get('admin-only')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
async adminEndpoint() {
  return { message: 'Admin only' };
}
```

### Available Guards
- `JwtAuthGuard` - Verify JWT token
- `RolesGuard` - Verify user roles
- `LocalAuthGuard` - Local authentication

## 📊 Available Scripts

```bash
# Development
npm run start:dev          # Development mode with watch
npm run start:debug        # Debug mode

# Production
npm run build              # Build application
npm run start:prod         # Run in production

# Database
npm run migration:run      # Run migrations
npm run migration:revert   # Revert migration
npm run seed:run          # Run seeders

# Docker
npm run docker:up         # Start containers
npm run docker:down       # Stop containers
npm run docker:logs       # View logs

# Testing
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage
```

## 🚀 Development

### Add new module
```bash
# Create module structure
mkdir -p src/modules/products/{controllers,dto,entities,interfaces,repositories,services}

# Follow the established pattern:
# 1. Create entity with TypeORM
# 2. Create DTOs with validations
# 3. Create repository interface
# 4. Implement repository
# 5. Create service with business logic
# 6. Create controller
# 7. Register in module
```

### Environment Variables

| Variable | Description | Default value |
|----------|-------------|---------------|
| `NODE_ENV` | Execution environment | `development` |
| `PORT` | Application port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres123` |
| `DB_NAME` | Database name | `nestjs_backoffice` |
| `JWT_SECRET` | JWT secret | `change-in-production` |
| `JWT_EXPIRES_IN` | Token expiration | `1d` |

## 🔧 Technologies Used

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL, TypeORM
- **Authentication**: JWT, Passport
- **Validation**: class-validator, class-transformer
- **Cache**: Redis
- **Containers**: Docker, Docker Compose
- **Testing**: Jest

## 📝 License

This project is licensed under the [MIT](LICENSE) license.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or issues, please open an issue in the repository. 
