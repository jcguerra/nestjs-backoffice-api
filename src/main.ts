import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Pipes de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remover propiedades no definidas en DTOs
      forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas
      transform: true, // Transformar tipos automáticamente
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Prefijo global para API
  const apiPrefix = configService.get('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Versionado de API
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Backoffice API')
    .setDescription(`
## API para Sistema de Backoffice Multi-Tenant

Esta API proporciona funcionalidades completas para la gestión de usuarios y organizaciones en un entorno multi-tenant.

### Características principales:
- **Autenticación JWT**: Sistema de autenticación basado en tokens JWT
- **Gestión de Usuarios**: CRUD completo para usuarios del sistema
- **Gestión de Organizaciones**: Sistema multi-tenant con organizaciones independientes
- **Control de Propietarios**: Gestión granular de propietarios y roles en organizaciones
- **Paginación**: Soporte para paginación en todos los endpoints de listado
- **Validación**: Validaciones exhaustivas en todos los endpoints

### Arquitectura Multi-Tenant:
- Cada organización es independiente y aislada
- Los usuarios pueden ser propietarios de múltiples organizaciones
- Roles específicos para diferentes niveles de acceso
- Soft deletes para mantener integridad de datos

### Autenticación:
Todos los endpoints requieren autenticación JWT excepto los de registro y login.
Use el token JWT en el header Authorization: Bearer <token>
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Introduce el token JWT obtenido del endpoint de login',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Autenticación - Endpoints para login, registro y gestión de tokens')
    .addTag('users', 'Usuarios - Endpoints para gestión CRUD de usuarios del sistema')
    .addTag('organizations', 'Organizaciones - Endpoints para gestión CRUD de organizaciones multi-tenant')
    .addTag('organization-owners', 'Propietarios - Endpoints para gestión de propietarios y roles en organizaciones')
    .setContact('Equipo de Desarrollo', 'https://ejemplo.com', 'dev@ejemplo.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3001', 'Servidor de Desarrollo (Docker)')
    .addServer('http://localhost:3000', 'Servidor de Desarrollo (Local)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Puerto de la aplicación
  const port = configService.get('PORT') || 3000;
  
  await app.listen(port);
  
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/${apiPrefix}/docs`);
  console.log(`📚 Adminer (BD): http://localhost:8080`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
