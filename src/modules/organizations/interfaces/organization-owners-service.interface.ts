import { Organization } from '../entities/organization.entity';
import { OrganizationOwner } from '../entities/organization-owner.entity';
import { User } from '../../users/entities/user.entity';
import { AddOwnersDto } from '../dto/add-owners.dto';
import { RemoveOwnersDto } from '../dto/remove-owners.dto';
import { UpdateOwnerRoleDto } from '../dto/update-owner-role.dto';

export interface IOrganizationOwnersService {
  // Gestión de owners
  addOwners(organizationId: string, addOwnersDto: AddOwnersDto, assignedBy?: string): Promise<Organization>;
  removeOwners(organizationId: string, removeOwnersDto: RemoveOwnersDto): Promise<Organization>;
  updateOwnerRole(organizationId: string, updateOwnerRoleDto: UpdateOwnerRoleDto): Promise<Organization>;
  
  // Consultas de owners
  getOwners(organizationId: string): Promise<OrganizationOwner[]>;
  getActiveOwners(organizationId: string): Promise<OrganizationOwner[]>;
  getOwnersByRole(organizationId: string, role: string): Promise<OrganizationOwner[]>;
  
  // Validaciones
  validateOwners(userIds: string[]): Promise<User[]>;
  isOwner(organizationId: string, userId: string): Promise<boolean>;
  isActiveOwner(organizationId: string, userId: string): Promise<boolean>;
  
  // Consultas inversas
  getOrganizationsByOwner(userId: string): Promise<Organization[]>;
  getActiveOrganizationsByOwner(userId: string): Promise<Organization[]>;
  
  // Operaciones de estado
  deactivateOwner(organizationId: string, userId: string): Promise<void>;
  reactivateOwner(organizationId: string, userId: string): Promise<void>;
} 