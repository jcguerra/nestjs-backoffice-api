import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { IOrganizationRepository } from '../repositories/organization.repository.interface';
import { IOrganizationOwnerRepository } from '../repositories/organization-owner.repository.interface';
import { IOrganizationsService } from '../interfaces/organizations-service.interface';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class OrganizationsService implements IOrganizationsService {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
    @Inject('IOrganizationOwnerRepository')
    private readonly ownerRepository: IOrganizationOwnerRepository
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    // Verificar si el nombre ya existe
    const existingOrganization = await this.organizationRepository.findByName(createOrganizationDto.name);
    if (existingOrganization) {
      throw new BadRequestException('Ya existe una organización con ese nombre');
    }

    // Verificar que los ownerIds existen (esto se podría hacer con una validación más robusta)
    if (!createOrganizationDto.ownerIds || createOrganizationDto.ownerIds.length === 0) {
      throw new BadRequestException('Debe especificar al menos un propietario');
    }

    // Crear la organización
    const organization = await this.organizationRepository.create({
      name: createOrganizationDto.name,
      description: createOrganizationDto.description,
      isActive: true,
    });

    // Agregar los owners iniciales
    try {
      for (const ownerId of createOrganizationDto.ownerIds) {
        await this.ownerRepository.addOwner(
          organization.id, 
          ownerId, 
          'OWNER', // Rol por defecto para los fundadores
          undefined // No hay assignedBy en la creación inicial
        );
      }
    } catch (error) {
      // Si hay error agregando owners, eliminar la organización creada
      await this.organizationRepository.delete(organization.id);
      throw new BadRequestException('Error al asignar propietarios: algunos usuarios no existen');
    }

    return organization;
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.findAll();
  }

  async findAllPaginated(page: number, limit: number): Promise<PaginatedResult<Organization>> {
    // Validar parámetros de paginación
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100; // Límite máximo para evitar sobrecarga

    const organizations = await this.organizationRepository.findAll();
    const total = organizations.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = organizations.slice(offset, offset + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organización no encontrada');
    }
    return organization;
  }

  async findByName(name: string): Promise<Organization | null> {
    return this.organizationRepository.findByName(name);
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    // Verificar que la organización existe
    const organization = await this.findOne(id);

    // Verificar que el nuevo nombre no esté en uso (si se está cambiando)
    if (updateOrganizationDto.name && updateOrganizationDto.name !== organization.name) {
      const existingOrganization = await this.organizationRepository.findByName(updateOrganizationDto.name);
      if (existingOrganization) {
        throw new BadRequestException('Ya existe una organización con ese nombre');
      }
    }

    return this.organizationRepository.update(id, updateOrganizationDto);
  }

  async remove(id: string): Promise<void> {
    // Verificar que la organización existe
    const organization = await this.findOne(id);

    // Remover todos los owners antes de eliminar la organización
    const ownersRemoved = await this.ownerRepository.removeAllOwners(id);
    console.log(`Removidos ${ownersRemoved} propietarios de la organización ${id}`);

    // Eliminar la organización
    const deleted = await this.organizationRepository.delete(id);
    if (!deleted) {
      throw new Error('Error al eliminar la organización');
    }
  }

  async findActiveOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.findActiveOrganizations();
  }

  async findByOwner(ownerId: string): Promise<Organization[]> {
    return this.organizationRepository.findByOwner(ownerId);
  }
} 