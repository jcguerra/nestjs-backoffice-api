import { Provider } from '@nestjs/common';

// Importar clases concretas
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationOwnerRepository } from '../repositories/organization-owner.repository';
import { OrganizationsService } from '../services/organizations.service';
import { OrganizationOwnersService } from '../services/organization-owners.service';
import { OrganizationMapper } from '../mappers/organization.mapper';

// Importar guards
import { OrganizationOwnerGuard } from '../guards/organization-owner.guard';
import { OrganizationRoleGuard } from '../guards/organization-role.guard';
import { OrganizationOwnershipGuard } from '../guards/organization-ownership.guard';

// Importar configuración
import { ORGANIZATION_TOKENS } from '../config/organizations.config';

/**
 * Providers de repositorios con sus interfaces
 */
export const REPOSITORY_PROVIDERS: Provider[] = [
  // Repositorios concretos
  OrganizationRepository,
  OrganizationOwnerRepository,
  
  // Interfaces de repositorios
  {
    provide: ORGANIZATION_TOKENS.ORGANIZATION_REPOSITORY,
    useExisting: OrganizationRepository,
  },
  {
    provide: ORGANIZATION_TOKENS.ORGANIZATION_OWNER_REPOSITORY,
    useExisting: OrganizationOwnerRepository,
  },
];

/**
 * Providers de servicios con sus interfaces
 */
export const SERVICE_PROVIDERS: Provider[] = [
  // Servicios concretos
  OrganizationsService,
  OrganizationOwnersService,
  
  // Interfaces de servicios
  {
    provide: ORGANIZATION_TOKENS.ORGANIZATIONS_SERVICE,
    useExisting: OrganizationsService,
  },
  {
    provide: ORGANIZATION_TOKENS.ORGANIZATION_OWNERS_SERVICE,
    useExisting: OrganizationOwnersService,
  },
];

/**
 * Providers de guards de seguridad
 */
export const GUARD_PROVIDERS: Provider[] = [
  OrganizationOwnerGuard,
  OrganizationRoleGuard,
  OrganizationOwnershipGuard,
];

/**
 * Providers de mappers y utilidades
 */
export const UTILITY_PROVIDERS: Provider[] = [
  OrganizationMapper,
];

/**
 * Todos los providers del módulo organizations
 */
export const ORGANIZATIONS_PROVIDERS: Provider[] = [
  ...REPOSITORY_PROVIDERS,
  ...SERVICE_PROVIDERS,
  ...GUARD_PROVIDERS,
  ...UTILITY_PROVIDERS,
];

/**
 * Providers exportables (para uso en otros módulos)
 */
export const ORGANIZATIONS_EXPORTS = [
  // Servicios
  OrganizationsService,
  OrganizationOwnersService,
  ORGANIZATION_TOKENS.ORGANIZATIONS_SERVICE,
  ORGANIZATION_TOKENS.ORGANIZATION_OWNERS_SERVICE,
  
  // Repositorios
  OrganizationRepository,
  OrganizationOwnerRepository,
  ORGANIZATION_TOKENS.ORGANIZATION_REPOSITORY,
  ORGANIZATION_TOKENS.ORGANIZATION_OWNER_REPOSITORY,
  
  // Guards
  OrganizationOwnerGuard,
  OrganizationRoleGuard,
  OrganizationOwnershipGuard,
  
  // Mappers
  OrganizationMapper,
];

/**
 * Factory para crear providers de testing
 * Permite mock de dependencias específicas
 */
export function createTestingProviders(mocks: Partial<Record<string, any>> = {}): Provider[] {
  return ORGANIZATIONS_PROVIDERS.map(provider => {
    if (typeof provider === 'object' && 'provide' in provider) {
      const token = provider.provide as string;
      if (mocks[token]) {
        return {
          ...provider,
          useValue: mocks[token],
        };
      }
    }
    return provider;
  });
}

/**
 * Configuración por defecto del módulo para testing
 */
export const TESTING_MODULE_METADATA = {
  providers: ORGANIZATIONS_PROVIDERS,
  exports: ORGANIZATIONS_EXPORTS,
}; 