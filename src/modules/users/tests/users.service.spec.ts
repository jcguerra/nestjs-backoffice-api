import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { UserRole } from '../../../common/enums/user-role.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserRepository } from '../repositories/user.repository.interface';

describe('UsersService', () => {
  let service: UsersService;
  let repository: IUserRepository;

  const mockUser: User = {
    id: 'uuid-test-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  } as any;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findActiveUsers: jest.fn(),
    findByRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<IUserRepository>('IUserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(repository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        isActive: true,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      };

      mockRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow('El email ya está en uso');
      expect(repository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      
      mockRepository.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid-test-id');

      expect(repository.findById).toHaveBeenCalledWith('uuid-test-id');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };

      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update('uuid-test-id', updateUserDto);

      expect(repository.findById).toHaveBeenCalledWith('uuid-test-id');
      expect(repository.update).toHaveBeenCalledWith('uuid-test-id', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.delete.mockResolvedValue(true);

      await service.remove('uuid-test-id');

      expect(repository.findById).toHaveBeenCalledWith('uuid-test-id');
      expect(repository.delete).toHaveBeenCalledWith('uuid-test-id');
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated users', async () => {
      const users = [mockUser, { ...mockUser, id: 'uuid-test-id-2' }];
      mockRepository.findAll.mockResolvedValue(users);

      const result = await service.findAllPaginated(1, 1);

      expect(result).toEqual({
        data: [mockUser],
        total: 2,
        page: 1,
        limit: 1,
        totalPages: 2,
      });
    });
  });

  describe('update - edge cases', () => {
    it('should throw error if updating to existing email', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const existingUser = { ...mockUser, id: 'different-id' };
      
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.update('uuid-test-id', updateUserDto)).rejects.toThrow('El email ya está en uso');
    });

    it('should allow updating to same email', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'test@example.com', // Same email as mockUser
      };

      const updatedUser = { ...mockUser, ...updateUserDto };

      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update('uuid-test-id', updateUserDto);

      expect(repository.update).toHaveBeenCalledWith('uuid-test-id', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove - edge cases', () => {
    it('should throw error if delete operation fails', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.remove('uuid-test-id')).rejects.toThrow('Error al eliminar el usuario');
    });
  });

  describe('findActiveUsers', () => {
    it('should return active users', async () => {
      const activeUsers = [mockUser];
      mockRepository.findActiveUsers.mockResolvedValue(activeUsers);

      const result = await service.findActiveUsers();

      expect(repository.findActiveUsers).toHaveBeenCalled();
      expect(result).toEqual(activeUsers);
    });
  });

  describe('findByRole', () => {
    it('should return users by role', async () => {
      const usersByRole = [mockUser];
      mockRepository.findByRole.mockResolvedValue(usersByRole);

      const result = await service.findByRole('USER');

      expect(repository.findByRole).toHaveBeenCalledWith('USER');
      expect(result).toEqual(usersByRole);
    });
  });
}); 