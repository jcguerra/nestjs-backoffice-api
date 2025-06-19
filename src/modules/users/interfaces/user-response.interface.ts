import { UserRole } from '../../../common/enums/user-role.enum';

// Interfaz base para respuestas de usuario (ISP)
export interface IUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para respuesta paginada (ISP)
export interface IPaginatedUsersResponse {
  data: IUserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interfaz para respuesta de eliminación (ISP)
export interface IDeleteResponse {
  message: string;
}

// Interfaz para operaciones de consulta de usuarios (ISP)
export interface IUserQueryOperations {
  findAll(): Promise<IUserResponse[]>;
  findOne(id: string): Promise<IUserResponse>;
  findActiveUsers(): Promise<IUserResponse[]>;
  findByRole(role: string): Promise<IUserResponse[]>;
}

// Interfaz para operaciones de modificación de usuarios (ISP)
export interface IUserMutationOperations {
  create(createUserDto: any): Promise<IUserResponse>;
  update(id: string, updateUserDto: any): Promise<IUserResponse>;
  remove(id: string): Promise<IDeleteResponse>;
}

// Interfaz para operaciones de paginación (ISP)
export interface IUserPaginationOperations {
  findAllPaginated(page: number, limit: number): Promise<IPaginatedUsersResponse>;
} 