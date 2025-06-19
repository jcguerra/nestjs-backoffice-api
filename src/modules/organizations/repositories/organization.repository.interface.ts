import { BaseRepositoryInterface } from '../../../common/interfaces/base-repository.interface';
import { Organization } from '../entities/organization.entity';

export interface IOrganizationRepository extends BaseRepositoryInterface<Organization> {
  findByName(name: string): Promise<Organization | null>;
  findActiveOrganizations(): Promise<Organization[]>;
  findByOwner(ownerId: string): Promise<Organization[]>;
  findWithOwners(id: string): Promise<Organization | null>;
  findAllWithOwners(): Promise<Organization[]>;
} 