import { Organization } from '../entities/organization.entity';
import { OrganizationOwner } from '../entities/organization-owner.entity';
import { 
  IOrganizationResponse, 
  IOrganizationWithOwnersResponse,
  IPaginatedOrganizationsResponse,
  IPaginatedOrganizationsWithOwnersResponse,
  IOwnerInfo,
  IDeleteResponse 
} from '../interfaces/organization-response.interface';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

export class OrganizationMapper {
  
  // ========== Mapeo básico de organización ==========
  
  static toResponse(organization: Organization): IOrganizationResponse {
    return {
      id: organization.id,
      name: organization.name,
      description: organization.description,
      isActive: organization.isActive,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }

  static toResponseArray(organizations: Organization[]): IOrganizationResponse[] {
    return organizations.map(organization => this.toResponse(organization));
  }

  // ========== Mapeo de organizaciones con owners ==========

  static toResponseWithOwners(organization: Organization): IOrganizationWithOwnersResponse {
    const baseResponse = this.toResponse(organization);
    
    // Mapear owners si están disponibles
    const owners: IOwnerInfo[] = organization.organizationOwners 
      ? organization.organizationOwners.map(owner => this.toOwnerInfo(owner))
      : [];

    return {
      ...baseResponse,
      owners,
    };
  }

  static toResponseWithOwnersArray(organizations: Organization[]): IOrganizationWithOwnersResponse[] {
    return organizations.map(organization => this.toResponseWithOwners(organization));
  }

  // ========== Mapeo de información de owners ==========

  static toOwnerInfo(organizationOwner: OrganizationOwner): IOwnerInfo {
    return {
      userId: organizationOwner.userId,
      email: organizationOwner.user?.email || '',
      firstName: organizationOwner.user?.firstName || '',
      lastName: organizationOwner.user?.lastName || '',
      role: organizationOwner.role,
      assignedAt: organizationOwner.assignedAt,
      assignedBy: organizationOwner.assignedBy,
      isActive: organizationOwner.isActive,
    };
  }

  static toOwnerInfoArray(organizationOwners: OrganizationOwner[]): IOwnerInfo[] {
    return organizationOwners.map(owner => this.toOwnerInfo(owner));
  }

  // ========== Mapeo de respuestas paginadas ==========

  static toPaginatedResponse(paginatedOrganizations: PaginatedResult<Organization>): IPaginatedOrganizationsResponse {
    return {
      data: this.toResponseArray(paginatedOrganizations.data),
      total: paginatedOrganizations.total,
      page: paginatedOrganizations.page,
      limit: paginatedOrganizations.limit,
      totalPages: paginatedOrganizations.totalPages,
    };
  }

  static toPaginatedResponseWithOwners(
    paginatedOrganizations: PaginatedResult<Organization>
  ): IPaginatedOrganizationsWithOwnersResponse {
    return {
      data: this.toResponseWithOwnersArray(paginatedOrganizations.data),
      total: paginatedOrganizations.total,
      page: paginatedOrganizations.page,
      limit: paginatedOrganizations.limit,
      totalPages: paginatedOrganizations.totalPages,
    };
  }

  // ========== Mapeo de respuestas de operaciones ==========

  static toDeleteResponse(message: string = 'Organización eliminada exitosamente'): IDeleteResponse {
    return {
      message,
    };
  }

  // ========== Métodos utilitarios ==========

  /**
   * Convierte una organización a respuesta, detectando automáticamente si incluir owners
   */
  static toAutoResponse(organization: Organization): IOrganizationResponse | IOrganizationWithOwnersResponse {
    if (organization.organizationOwners && organization.organizationOwners.length > 0) {
      return this.toResponseWithOwners(organization);
    }
    return this.toResponse(organization);
  }

  /**
   * Filtra owners activos solamente
   */
  static toResponseWithActiveOwners(organization: Organization): IOrganizationWithOwnersResponse {
    const baseResponse = this.toResponse(organization);
    
    // Solo incluir owners activos
    const activeOwners: IOwnerInfo[] = organization.organizationOwners 
      ? organization.organizationOwners
          .filter(owner => owner.isActive)
          .map(owner => this.toOwnerInfo(owner))
      : [];

    return {
      ...baseResponse,
      owners: activeOwners,
    };
  }

  /**
   * Mapea organizaciones agrupando owners por rol
   */
  static toResponseWithOwnersByRole(organization: Organization): IOrganizationWithOwnersResponse & { ownersByRole: Record<string, IOwnerInfo[]> } {
    const baseWithOwners = this.toResponseWithOwners(organization);
    
    // Agrupar owners por rol
    const ownersByRole: Record<string, IOwnerInfo[]> = {};
    baseWithOwners.owners.forEach(owner => {
      if (!ownersByRole[owner.role]) {
        ownersByRole[owner.role] = [];
      }
      ownersByRole[owner.role].push(owner);
    });

    return {
      ...baseWithOwners,
      ownersByRole,
    };
  }

  /**
   * Crear respuesta de error personalizada
   */
  static toErrorResponse(message: string, errorCode?: string): { error: string; code?: string } {
    return {
      error: message,
      ...(errorCode && { code: errorCode }),
    };
  }
} 