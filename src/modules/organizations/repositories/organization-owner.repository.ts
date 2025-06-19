import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationOwner } from '../entities/organization-owner.entity';
import { IOrganizationOwnerRepository } from './organization-owner.repository.interface';

@Injectable()
export class OrganizationOwnerRepository implements IOrganizationOwnerRepository {
  constructor(
    @InjectRepository(OrganizationOwner)
    private readonly ownerRepository: Repository<OrganizationOwner>,
  ) {}

  // ========== Gestión de owners ==========

  async addOwner(
    organizationId: string, 
    userId: string, 
    role: string = 'OWNER', 
    assignedBy?: string
  ): Promise<OrganizationOwner> {
    const owner = this.ownerRepository.create({
      organizationId,
      userId,
      role,
      assignedBy,
      assignedAt: new Date(),
      isActive: true
    });
    return this.ownerRepository.save(owner);
  }

  async removeOwner(organizationId: string, userId: string): Promise<boolean> {
    const result = await this.ownerRepository.delete({
      organizationId,
      userId
    });
    return (result.affected ?? 0) > 0;
  }

  async updateOwnerRole(
    organizationId: string, 
    userId: string, 
    newRole: string
  ): Promise<OrganizationOwner> {
    await this.ownerRepository.update(
      { organizationId, userId },
      { role: newRole }
    );
    
    const updatedOwner = await this.findOwnerRelation(organizationId, userId);
    if (!updatedOwner) {
      throw new Error('Relación de propietario no encontrada');
    }
    return updatedOwner;
  }

  // ========== Consultas de owners ==========

  async findOwners(organizationId: string): Promise<OrganizationOwner[]> {
    return this.ownerRepository.find({
      where: { organizationId }
    });
  }

  async findActiveOwners(organizationId: string): Promise<OrganizationOwner[]> {
    return this.ownerRepository.find({
      where: { 
        organizationId, 
        isActive: true 
      }
    });
  }

  async findOwnersByRole(organizationId: string, role: string): Promise<OrganizationOwner[]> {
    return this.ownerRepository.find({
      where: { 
        organizationId, 
        role,
        isActive: true 
      }
    });
  }

  async findOwnerRelation(organizationId: string, userId: string): Promise<OrganizationOwner | null> {
    return this.ownerRepository.findOne({
      where: { organizationId, userId }
    });
  }

  // ========== Validaciones ==========

  async isOwner(organizationId: string, userId: string): Promise<boolean> {
    const count = await this.ownerRepository.count({
      where: { organizationId, userId }
    });
    return count > 0;
  }

  async isActiveOwner(organizationId: string, userId: string): Promise<boolean> {
    const count = await this.ownerRepository.count({
      where: { 
        organizationId, 
        userId, 
        isActive: true 
      }
    });
    return count > 0;
  }

  async ownerExists(organizationId: string, userId: string): Promise<boolean> {
    return this.isOwner(organizationId, userId);
  }

  // ========== Consultas inversas ==========

  async findOrganizationsByOwner(userId: string): Promise<OrganizationOwner[]> {
    return this.ownerRepository.find({
      where: { userId }
    });
  }

  async findActiveOrganizationsByOwner(userId: string): Promise<OrganizationOwner[]> {
    return this.ownerRepository.find({
      where: { 
        userId, 
        isActive: true 
      }
    });
  }

  async findOrganizationsByRole(userId: string, role: string): Promise<OrganizationOwner[]> {
    return this.ownerRepository.find({
      where: { 
        userId, 
        role,
        isActive: true 
      }
    });
  }

  // ========== Operaciones de estado ==========

  async deactivateOwner(organizationId: string, userId: string): Promise<void> {
    await this.ownerRepository.update(
      { organizationId, userId },
      { isActive: false }
    );
  }

  async reactivateOwner(organizationId: string, userId: string): Promise<void> {
    await this.ownerRepository.update(
      { organizationId, userId },
      { isActive: true }
    );
  }

  // ========== Consultas con joins ==========

  async findOwnersWithUserInfo(organizationId: string): Promise<OrganizationOwner[]> {
    return this.ownerRepository
      .createQueryBuilder('owner')
      .leftJoinAndSelect('owner.user', 'user')
      .where('owner.organizationId = :organizationId', { organizationId })
      .andWhere('owner.isActive = :isActive', { isActive: true })
      .orderBy('owner.assignedAt', 'ASC')
      .getMany();
  }

  async findOrganizationsWithOrgInfo(userId: string): Promise<OrganizationOwner[]> {
    return this.ownerRepository
      .createQueryBuilder('owner')
      .leftJoinAndSelect('owner.organization', 'organization')
      .where('owner.userId = :userId', { userId })
      .andWhere('owner.isActive = :isActive', { isActive: true })
      .andWhere('organization.isActive = :orgActive', { orgActive: true })
      .orderBy('owner.assignedAt', 'DESC')
      .getMany();
  }

  // ========== Operaciones de limpieza ==========

  async removeAllOwners(organizationId: string): Promise<number> {
    const result = await this.ownerRepository.delete({ organizationId });
    return result.affected ?? 0;
  }

  async removeUserFromAllOrganizations(userId: string): Promise<number> {
    const result = await this.ownerRepository.delete({ userId });
    return result.affected ?? 0;
  }

  // ========== Estadísticas ==========

  async countOwners(organizationId: string): Promise<number> {
    return this.ownerRepository.count({
      where: { organizationId }
    });
  }

  async countActiveOwners(organizationId: string): Promise<number> {
    return this.ownerRepository.count({
      where: { 
        organizationId, 
        isActive: true 
      }
    });
  }

  async countOrganizationsByOwner(userId: string): Promise<number> {
    return this.ownerRepository.count({
      where: { 
        userId, 
        isActive: true 
      }
    });
  }
} 