import { User } from '../entities/user.entity';
import { IUserResponse, IPaginatedUsersResponse, IDeleteResponse } from '../interfaces/user-response.interface';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

export class UserMapper {
  static toResponse(user: User): IUserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseArray(users: User[]): IUserResponse[] {
    return users.map(user => this.toResponse(user));
  }

  static toPaginatedResponse(paginatedUsers: PaginatedResult<User>): IPaginatedUsersResponse {
    return {
      data: this.toResponseArray(paginatedUsers.data),
      total: paginatedUsers.total,
      page: paginatedUsers.page,
      limit: paginatedUsers.limit,
      totalPages: paginatedUsers.totalPages,
    };
  }

  static toDeleteResponse(message: string = 'Usuario eliminado exitosamente'): IDeleteResponse {
    return {
      message,
    };
  }
} 