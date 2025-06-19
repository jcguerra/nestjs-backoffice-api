import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { IOrganizationRepository } from './organization.repository.interface';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  // ========== Métodos heredados de BaseRepositoryInterface ==========
  
  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizationRepository.findOne({ where: { id } });
  }

  async findOne(conditions: Partial<Organization>): Promise<Organization | null> {
    return this.organizationRepository.findOne({ where: conditions as any });
  }

  async create(organizationData: Partial<Organization>): Promise<Organization> {
    const organization = this.organizationRepository.create(organizationData);
    return this.organizationRepository.save(organization);
  }

  async update(id: string, organizationData: Partial<Organization>): Promise<Organization> {
    await this.organizationRepository.update(id, organizationData);
    const updatedOrganization = await this.findById(id);
    if (!updatedOrganization) {
      throw new Error('Organización no encontrada');
    }
    return updatedOrganization;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.organizationRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(conditions?: Partial<Organization>): Promise<number> {
    return this.organizationRepository.count({ where: conditions as any });
  }

  async exists(conditions: Partial<Organization>): Promise<boolean> {
    const count = await this.organizationRepository.count({ where: conditions as any });
    return count > 0;
  }

  // ========== Métodos específicos de IOrganizationRepository ==========

  async findByName(name: string): Promise<Organization | null> {
    return this.organizationRepository.findOne({ 
      where: { name } 
    });
  }

  async findActiveOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find({ 
      where: { isActive: true } 
    });
  }

  async findByOwner(ownerId: string): Promise<Organization[]> {
    return this.organizationRepository
      .createQueryBuilder('organization')
      .innerJoin('organization.owners', 'owner')
      .where('owner.userId = :ownerId', { ownerId })
      .andWhere('owner.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async findWithOwners(id: string): Promise<Organization | null> {
    return this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.owners', 'owner')
      .leftJoinAndSelect('owner.user', 'user')
      .where('organization.id = :id', { id })
      .getOne();
  }

  async findAllWithOwners(): Promise<Organization[]> {
    return this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.owners', 'owner')
      .leftJoinAndSelect('owner.user', 'user')
      .orderBy('organization.createdAt', 'DESC')
      .getMany();
  }
} 