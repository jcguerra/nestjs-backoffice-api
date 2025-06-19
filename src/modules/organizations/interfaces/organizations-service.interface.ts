import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IOrganizationsService {
  create(createOrganizationDto: CreateOrganizationDto): Promise<Organization>;
  findAll(): Promise<Organization[]>;
  findAllPaginated(page: number, limit: number): Promise<PaginatedResult<Organization>>;
  findOne(id: string): Promise<Organization>;
  findByName(name: string): Promise<Organization | null>;
  update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization>;
  remove(id: string): Promise<void>;
  findActiveOrganizations(): Promise<Organization[]>;
  findByOwner(ownerId: string): Promise<Organization[]>;
} 