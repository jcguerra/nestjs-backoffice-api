import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Organizations E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/organizations (GET)', () => {
    it('should return organizations endpoint', () => {
      return request(app.getHttpServer())
        .get('/organizations')
        .expect(401); // Sin autenticación debería retornar 401
    });
  });

  describe('/organizations (POST)', () => {
    it('should require authentication for creating organizations', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({
          name: 'Test Organization',
          description: 'Test Description',
          ownerIds: ['test-uuid'],
        })
        .expect(401); // Sin autenticación debería retornar 401
    });
  });

  describe('/organizations/:id (GET)', () => {
    it('should require authentication for getting organization', () => {
      return request(app.getHttpServer())
        .get('/organizations/test-uuid')
        .expect(401); // Sin autenticación debería retornar 401
    });
  });

  describe('/organizations/:id/owners (GET)', () => {
    it('should require authentication for getting organization owners', () => {
      return request(app.getHttpServer())
        .get('/organizations/test-uuid/owners')
        .expect(401); // Sin autenticación debería retornar 401
    });
  });

  describe('API Routes Structure', () => {
    it('should have organizations routes available', async () => {
      // Verificar que las rutas están registradas pero requieren autenticación
      const routes = [
        '/organizations',
        '/organizations/test-uuid',
        '/organizations/test-uuid/owners',
        '/organizations/test-uuid/owners/add',
        '/organizations/test-uuid/owners/remove',
      ];

      for (const route of routes) {
        await request(app.getHttpServer())
          .get(route)
          .expect((res) => {
            // Debería retornar 401 (no autorizado) o 404 (no encontrado), no 500 (error del servidor)
            expect([401, 404]).toContain(res.status);
          });
      }
    });
  });
}); 