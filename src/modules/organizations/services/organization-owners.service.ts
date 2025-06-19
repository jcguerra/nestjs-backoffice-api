import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Organization } from '../entities/organization.entity';
import { OrganizationOwner } from '../entities/organization-owner.entity';
import { User } from '../../users/entities/user.entity';
import { AddOwnersDto } from '../dto/add-owners.dto';
import { RemoveOwnersDto } from '../dto/remove-owners.dto';
import { UpdateOwnerRoleDto } from '../dto/update-owner-role.dto';
import { IOrganizationRepository } from '../repositories/organization.repository.interface';
import { IOrganizationOwnerRepository } from '../repositories/organization-owner.repository.interface';
import { IUserRepository } from '../../users/repositories/user.repository.interface';
import { IOrganizationOwnersService } from '../interfaces/organization-owners-service.interface';

@Injectable()
export class OrganizationOwnersService implements IOrganizationOwnersService {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @Inject('IOrganizationOwnerRepository')
    private readonly ownerRepository: IOrganizationOwnerRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  // ========== Gestión de owners ==========

  async addOwners(
    organizationId: string, 
    addOwnersDto: AddOwnersDto, 
    assignedBy?: string
  ): Promise<Organization> {
    // Verificar que la organización existe
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organización no encontrada');
    }

    // Validar que los usuarios existen
    const validUsers = await this.validateOwners(addOwnersDto.userIds);
    
    // Verificar que no sean ya owners activos
    const existingOwners: string[] = [];
    for (const userId of addOwnersDto.userIds) {
      const isAlreadyOwner = await this.ownerRepository.isActiveOwner(organizationId, userId);
      if (isAlreadyOwner) {
        existingOwners.push(userId);
      }
    }

    if (existingOwners.length > 0) {
      throw new BadRequestException(`Los siguientes usuarios ya son propietarios activos: ${existingOwners.join(', ')}`);
    }

    // Agregar los nuevos owners
    const role = addOwnersDto.role || 'OWNER';
    for (const userId of addOwnersDto.userIds) {
      await this.ownerRepository.addOwner(organizationId, userId, role, assignedBy);
    }

    // Retornar la organización con owners actualizados
    return this.organizationRepository.findWithOwners(organizationId) as Promise<Organization>;
  }

  async removeOwners(organizationId: string, removeOwnersDto: RemoveOwnersDto): Promise<Organization> {
    // Verificar que la organización existe
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organización no encontrada');
    }

    // Verificar que no se está intentando remover a todos los owners
    const currentOwnersCount = await this.ownerRepository.countActiveOwners(organizationId);
    if (currentOwnersCount <= removeOwnersDto.userIds.length) {
      throw new BadRequestException('No se puede eliminar a todos los propietarios. Debe quedar al menos uno activo');
    }

    // Verificar que los usuarios son realmente owners
    const invalidOwners: string[] = [];
    for (const userId of removeOwnersDto.userIds) {
      const isOwner = await this.ownerRepository.isActiveOwner(organizationId, userId);
      if (!isOwner) {
        invalidOwners.push(userId);
      }
    }

    if (invalidOwners.length > 0) {
      throw new BadRequestException(`Los siguientes usuarios no son propietarios activos: ${invalidOwners.join(', ')}`);
    }

    // Remover los owners
    for (const userId of removeOwnersDto.userIds) {
      await this.ownerRepository.removeOwner(organizationId, userId);
    }

    // Retornar la organización con owners actualizados
    return this.organizationRepository.findWithOwners(organizationId) as Promise<Organization>;
  }

  async updateOwnerRole(
    organizationId: string, 
    updateOwnerRoleDto: UpdateOwnerRoleDto
  ): Promise<Organization> {
    // Verificar que la organización existe
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organización no encontrada');
    }

    // Verificar que el usuario es owner activo
    const isActiveOwner = await this.ownerRepository.isActiveOwner(organizationId, updateOwnerRoleDto.userId);
    if (!isActiveOwner) {
      throw new BadRequestException('El usuario no es un propietario activo de la organización');
    }

    // Actualizar el rol
    await this.ownerRepository.updateOwnerRole(
      organizationId, 
      updateOwnerRoleDto.userId, 
      updateOwnerRoleDto.newRole
    );

    // Retornar la organización con owners actualizados
    return this.organizationRepository.findWithOwners(organizationId) as Promise<Organization>;
  }

  // ========== Consultas de owners ==========

  async getOwners(organizationId: string): Promise<OrganizationOwner[]> {
    // Verificar que la organización existe
    await this.verifyOrganizationExists(organizationId);
    
    return this.ownerRepository.findOwnersWithUserInfo(organizationId);
  }

  async getActiveOwners(organizationId: string): Promise<OrganizationOwner[]> {
    // Verificar que la organización existe
    await this.verifyOrganizationExists(organizationId);
    
    return this.ownerRepository.findActiveOwners(organizationId);
  }

  async getOwnersByRole(organizationId: string, role: string): Promise<OrganizationOwner[]> {
    // Verificar que la organización existe
    await this.verifyOrganizationExists(organizationId);
    
    return this.ownerRepository.findOwnersByRole(organizationId, role);
  }

  // ========== Validaciones ==========

  async validateOwners(userIds: string[]): Promise<User[]> {
    const users: User[] = [];
    const invalidUserIds: string[] = [];

    for (const userId of userIds) {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        invalidUserIds.push(userId);
      } else if (!user.isActive) {
        throw new BadRequestException(`El usuario ${userId} no está activo`);
      } else {
        users.push(user);
      }
    }

    if (invalidUserIds.length > 0) {
      throw new BadRequestException(`Los siguientes usuarios no existen: ${invalidUserIds.join(', ')}`);
    }

    return users;
  }

  async isOwner(organizationId: string, userId: string): Promise<boolean> {
    return this.ownerRepository.isOwner(organizationId, userId);
  }

  async isActiveOwner(organizationId: string, userId: string): Promise<boolean> {
    return this.ownerRepository.isActiveOwner(organizationId, userId);
  }

  // ========== Consultas inversas ==========

  async getOrganizationsByOwner(userId: string): Promise<Organization[]> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener organizaciones donde es owner
    const ownerRelations = await this.ownerRepository.findOrganizationsWithOrgInfo(userId);
    
    // Extraer solo las organizaciones (sin duplicados)
    const organizations = ownerRelations
      .map(relation => relation.organization)
      .filter((org, index, self) => org && self.findIndex(o => o?.id === org.id) === index) as Organization[];

    return organizations;
  }

  async getActiveOrganizationsByOwner(userId: string): Promise<Organization[]> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener solo organizaciones activas donde es owner activo
    const ownerRelations = await this.ownerRepository.findActiveOrganizationsByOwner(userId);
    
    // Extraer organizaciones activas
    const organizations = ownerRelations
      .map(relation => relation.organization)
      .filter((org, index, self) => 
        org && 
        org.isActive && 
        self.findIndex(o => o?.id === org.id) === index
      ) as Organization[];

    return organizations;
  }

  // ========== Operaciones de estado ==========

  async deactivateOwner(organizationId: string, userId: string): Promise<void> {
    // Verificar que la organización existe
    await this.verifyOrganizationExists(organizationId);

    // Verificar que el usuario es owner activo
    const isActiveOwner = await this.ownerRepository.isActiveOwner(organizationId, userId);
    if (!isActiveOwner) {
      throw new BadRequestException('El usuario no es un propietario activo de la organización');
    }

    // Verificar que no es el último owner activo
    const activeOwnersCount = await this.ownerRepository.countActiveOwners(organizationId);
    if (activeOwnersCount <= 1) {
      throw new BadRequestException('No se puede desactivar al único propietario activo');
    }

    await this.ownerRepository.deactivateOwner(organizationId, userId);
  }

  async reactivateOwner(organizationId: string, userId: string): Promise<void> {
    // Verificar que la organización existe
    await this.verifyOrganizationExists(organizationId);

    // Verificar que existe la relación (aunque esté inactiva)
    const ownerExists = await this.ownerRepository.ownerExists(organizationId, userId);
    if (!ownerExists) {
      throw new BadRequestException('No existe relación de propietario entre el usuario y la organización');
    }

    // Verificar que no está ya activo
    const isActiveOwner = await this.ownerRepository.isActiveOwner(organizationId, userId);
    if (isActiveOwner) {
      throw new BadRequestException('El usuario ya es un propietario activo');
    }

    await this.ownerRepository.reactivateOwner(organizationId, userId);
  }

  // ========== Métodos auxiliares ==========

  private async verifyOrganizationExists(organizationId: string): Promise<Organization> {
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organización no encontrada');
    }
    return organization;
  }
} 