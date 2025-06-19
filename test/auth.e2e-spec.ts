import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getTestDatabaseConfig } from '../src/config/test-database.config';
import { UserRole } from '../src/common/enums/user-role.enum';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  
  // Generate unique timestamp for this test run
  const timestamp = Date.now();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Aplicar la misma configuración que main.ts
    const configService = app.get(ConfigService);
    
    // Habilitar CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });

    // Pipes de validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false, // Para tests, permitir mensajes de error
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
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration Flow', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: `e2e-${timestamp}@test.com`,
        password: 'password123',
        firstName: 'E2E',
        lastName: 'Test',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(registerDto.email);
      expect(response.body.user.role).toBe(UserRole.USER);
      expect(response.body.user).not.toHaveProperty('password');

      authToken = response.body.access_token;
    });

    it('should not register user with existing email', async () => {
      const registerDto = {
        email: `e2e-${timestamp}@test.com`, // Same email as above
        password: 'password123',
        firstName: 'E2E',
        lastName: 'Test',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(registerDto)
        .expect(409); // Conflict
    });
  });

  describe('Login Flow', () => {
    it('should login with valid credentials', async () => {
      const loginDto = {
        email: `e2e-${timestamp}@test.com`,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginDto.email);
    });

    it('should not login with invalid credentials', async () => {
      const loginDto = {
        email: `e2e-${timestamp}@test.com`,
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('Protected Routes', () => {
    it('should access profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.email).toBe(`e2e-${timestamp}@test.com`);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not access profile without token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .expect(401);
    });

    it('should not access profile with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Role-Based Access', () => {
    let adminToken: string;

    beforeAll(async () => {
      // Register a regular admin user through registration
      // Note: In a real app, admin creation would be handled differently
      // For testing purposes, we'll register and then manually check if user management works
      
      const adminRegisterDto = {
        email: `admin-${timestamp}@test.com`,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
      };

      // Register the admin user
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(adminRegisterDto)
        .expect(201);

      // Login as admin to get token
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: `admin-${timestamp}@test.com`,
          password: 'password123',
        })
        .expect(200);

      adminToken = loginResponse.body.access_token;
    });

    it('should allow authenticated user to access users list', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should allow authenticated user to create new users', async () => {
      const newUserDto = {
        email: `newuser-${timestamp}@test.com`,
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: UserRole.USER,
      };

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUserDto)
        .expect(201);
    });

    it('should not allow access to users without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(401); // Unauthorized
    });
  });
}); 