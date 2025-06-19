import { OrganizationOwner } from '../entities/organization-owner.entity';
import { Organization } from '../entities/organization.entity';
import { User } from '../../users/entities/user.entity';

export interface IOrganizationOwnerRepository {
  // Gestión de owners
  addOwner(organizationId: string, userId: string, role?: string, assignedBy?: string): Promise<OrganizationOwner>;
  removeOwner(organizationId: string, userId: string): Promise<boolean>;
  updateOwnerRole(organizationId: string, userId: string, newRole: string): Promise<OrganizationOwner>;
  
  // Consultas de owners
  findOwners(organizationId: string): Promise<OrganizationOwner[]>;
  findActiveOwners(organizationId: string): Promise<OrganizationOwner[]>;
  findOwnersByRole(organizationId: string, role: string): Promise<OrganizationOwner[]>;
  findOwnerRelation(organizationId: string, userId: string): Promise<OrganizationOwner | null>;
  
  // Validaciones
  isOwner(organizationId: string, userId: string): Promise<boolean>;
  isActiveOwner(organizationId: string, userId: string): Promise<boolean>;
  ownerExists(organizationId: string, userId: string): Promise<boolean>;
  
  // Consultas inversas
  findOrganizationsByOwner(userId: string): Promise<OrganizationOwner[]>;
  findActiveOrganizationsByOwner(userId: string): Promise<OrganizationOwner[]>;
  findOrganizationsByRole(userId: string, role: string): Promise<OrganizationOwner[]>;
  
  // Operaciones de estado
  deactivateOwner(organizationId: string, userId: string): Promise<void>;
  reactivateOwner(organizationId: string, userId: string): Promise<void>;
  
  // Consultas con joins
  findOwnersWithUserInfo(organizationId: string): Promise<OrganizationOwner[]>;
  findOrganizationsWithOrgInfo(userId: string): Promise<OrganizationOwner[]>;
  
  // Operaciones de limpieza
  removeAllOwners(organizationId: string): Promise<number>;
  removeUserFromAllOrganizations(userId: string): Promise<number>;
  
  // Estadísticas
  countOwners(organizationId: string): Promise<number>;
  countActiveOwners(organizationId: string): Promise<number>;
  countOrganizationsByOwner(userId: string): Promise<number>;
} 