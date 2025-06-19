import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades
import { Organization } from './entities/organization.entity';
import { OrganizationOwner } from './entities/organization-owner.entity';

// Controladores
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationOwnersController } from './controllers/organization-owners.controller';

// Middleware
import { OrganizationContextMiddleware } from './middleware/organization-context.middleware';

// Dependencias externas
import { UsersModule } from '../users/users.module';

// Configuración
import { ORGANIZATION_TOKENS, MIDDLEWARE_CONFIG } from './config/organizations.config';

// Providers
import { ORGANIZATIONS_PROVIDERS, ORGANIZATIONS_EXPORTS } from './providers/organizations.providers';

@Module({
  imports: [
    // Entidades TypeORM
    TypeOrmModule.forFeature([Organization, OrganizationOwner]),
    
    // Módulos dependientes
    UsersModule, // Necesario para validaciones de usuarios en organizaciones
  ],
  controllers: [
    OrganizationsController,
    OrganizationOwnersController,
  ],
  providers: ORGANIZATIONS_PROVIDERS,
  exports: ORGANIZATIONS_EXPORTS,
})
export class OrganizationsModule implements NestModule {
  /**
   * Configuración de middleware para rutas de organizaciones
   * 
   * El middleware OrganizationContextMiddleware se aplica automáticamente
   * a todas las rutas que contengan el parámetro :organizationId
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OrganizationContextMiddleware)
      .forRoutes(
        // Aplicar a todas las rutas de organizaciones que requieren contexto
        ...MIDDLEWARE_CONFIG.CONTEXT_ROUTES
      );
  }
} 