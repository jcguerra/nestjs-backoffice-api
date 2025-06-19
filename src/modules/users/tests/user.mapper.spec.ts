import { UserMapper } from '../mappers/user.mapper';
import { User } from '../entities/user.entity';
import { UserRole } from '../../../common/enums/user-role.enum';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

describe('UserMapper', () => {
  const mockUser: User = {
    id: 'uuid-test-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  } as any;

  describe('toResponse', () => {
    it('should transform User entity to IUserResponse', () => {
      const result = UserMapper.toResponse(mockUser);

      expect(result).toEqual({
        id: 'uuid-test-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });
    });

    it('should not include password in response', () => {
      const result = UserMapper.toResponse(mockUser);

      expect(result).not.toHaveProperty('password');
    });

    it('should not include methods in response', () => {
      const result = UserMapper.toResponse(mockUser);

      expect(result).not.toHaveProperty('hashPassword');
      expect(result).not.toHaveProperty('validatePassword');
    });
  });

  describe('toResponseArray', () => {
    it('should transform array of User entities to array of IUserResponse', () => {
      const mockUser2 = {
        ...mockUser,
        id: 'uuid-test-id-2',
        email: 'test2@example.com',
        hashPassword: jest.fn(),
        validatePassword: jest.fn(),
      } as any;
      const users = [mockUser, mockUser2];
      
      const result = UserMapper.toResponseArray(users);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'uuid-test-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });
      expect(result[1]).toEqual({
        id: 'uuid-test-id-2',
        email: 'test2@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });
    });

    it('should return empty array when given empty array', () => {
      const result = UserMapper.toResponseArray([]);

      expect(result).toEqual([]);
    });
  });

  describe('toPaginatedResponse', () => {
    it('should transform PaginatedResult<User> to IPaginatedUsersResponse', () => {
      const paginatedUsers: PaginatedResult<User> = {
        data: [mockUser],
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
      };

      const result = UserMapper.toPaginatedResponse(paginatedUsers);

      expect(result).toEqual({
        data: [{
          id: 'uuid-test-id',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.USER,
          isActive: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
        }],
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
      });
    });

    it('should handle empty paginated results', () => {
      const paginatedUsers: PaginatedResult<User> = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      const result = UserMapper.toPaginatedResponse(paginatedUsers);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });
  });

  describe('toDeleteResponse', () => {
    it('should return default delete message when no message provided', () => {
      const result = UserMapper.toDeleteResponse();

      expect(result).toEqual({
        message: 'Usuario eliminado exitosamente',
      });
    });

    it('should return custom message when provided', () => {
      const customMessage = 'Usuario eliminado con éxito';
      const result = UserMapper.toDeleteResponse(customMessage);

      expect(result).toEqual({
        message: customMessage,
      });
    });
  });
}); 