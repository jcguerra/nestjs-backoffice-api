/**
 * Barrel export del módulo Organizations
 * 
 * Exporta todos los componentes públicos del módulo para facilitar
 * las importaciones desde otros módulos.
 */

// ========== MÓDULO PRINCIPAL ==========
export { OrganizationsModule } from './organizations.module';

// ========== ENTIDADES ==========
export { Organization } from './entities/organization.entity';
export { OrganizationOwner } from './entities/organization-owner.entity';

// ========== DTOs ==========
export { CreateOrganizationDto } from './dto/create-organization.dto';
export { UpdateOrganizationDto } from './dto/update-organization.dto';
export { AddOwnersDto } from './dto/add-owners.dto';
export { RemoveOwnersDto } from './dto/remove-owners.dto';
export { UpdateOwnerRoleDto } from './dto/update-owner-role.dto';

// ========== INTERFACES ==========
export * from './interfaces/organization.interface';
export * from './interfaces/organization-owner.interface';
export * from './interfaces/organization-response.interface';
export * from './interfaces/organizations-service.interface';
export * from './interfaces/organization-owners-service.interface';

// ========== REPOSITORIOS ==========
export { OrganizationRepository } from './repositories/organization.repository';
export { OrganizationOwnerRepository } from './repositories/organization-owner.repository';
export * from './repositories/organization.repository.interface';
export * from './repositories/organization-owner.repository.interface';

// ========== SERVICIOS ==========
export { OrganizationsService } from './services/organizations.service';
export { OrganizationOwnersService } from './services/organization-owners.service';

// ========== CONTROLADORES ==========
export { OrganizationsController } from './controllers/organizations.controller';
export { OrganizationOwnersController } from './controllers/organization-owners.controller';

// ========== MAPPERS ==========
export { OrganizationMapper } from './mappers/organization.mapper';

// ========== GUARDS ==========
export * from './guards';

// ========== DECORADORES ==========
export * from './decorators';

// ========== MIDDLEWARE ==========
export * from './middleware';

// ========== CONFIGURACIÓN ==========
export * from './config/organizations.config'; 