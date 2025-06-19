// Interfaz base para respuestas de organización (ISP)
export interface IOrganizationResponse {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para respuesta de organización con información de owners (ISP)
export interface IOrganizationWithOwnersResponse extends IOrganizationResponse {
  owners: IOwnerInfo[];
}

// Interfaz para información básica de un owner
export interface IOwnerInfo {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  assignedAt: Date;
  assignedBy: string | null;
  isActive: boolean;
}

// Interfaz para respuesta paginada de organizaciones (ISP)
export interface IPaginatedOrganizationsResponse {
  data: IOrganizationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interfaz para respuesta paginada de organizaciones con owners (ISP)
export interface IPaginatedOrganizationsWithOwnersResponse {
  data: IOrganizationWithOwnersResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interfaz para respuesta de eliminación (ISP) - Reutilizable
export interface IDeleteResponse {
  message: string;
}

// Interfaz para operaciones de consulta de organizaciones (ISP)
export interface IOrganizationQueryOperations {
  findAll(): Promise<IOrganizationResponse[]>;
  findOne(id: string): Promise<IOrganizationResponse>;
  findActiveOrganizations(): Promise<IOrganizationResponse[]>;
  findByName(name: string): Promise<IOrganizationResponse>;
  findByOwner(ownerId: string): Promise<IOrganizationResponse[]>;
}

// Interfaz para operaciones de modificación de organizaciones (ISP)
export interface IOrganizationMutationOperations {
  create(createOrganizationDto: any): Promise<IOrganizationResponse>;
  update(id: string, updateOrganizationDto: any): Promise<IOrganizationResponse>;
  remove(id: string): Promise<IDeleteResponse>;
}

// Interfaz para operaciones de paginación de organizaciones (ISP)
export interface IOrganizationPaginationOperations {
  findAllPaginated(page: number, limit: number): Promise<IPaginatedOrganizationsResponse>;
  findAllWithOwnersPaginated(page: number, limit: number): Promise<IPaginatedOrganizationsWithOwnersResponse>;
}

// Interfaz para operaciones de gestión de owners (ISP)
export interface IOrganizationOwnersOperations {
  addOwners(organizationId: string, userIds: string[], role?: string): Promise<IOrganizationWithOwnersResponse>;
  removeOwners(organizationId: string, userIds: string[]): Promise<IOrganizationWithOwnersResponse>;
  updateOwnerRole(organizationId: string, userId: string, newRole: string): Promise<IOrganizationWithOwnersResponse>;
  getOwners(organizationId: string): Promise<IOwnerInfo[]>;
} 