import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { IUsersService } from '../interfaces/users-service.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { User } from '../entities/user.entity';
import { UserRole } from '../../../common/enums/user-role.enum';
import { UserMapper } from '../mappers/user.mapper';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: IUsersService;

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

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllPaginated: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findActiveUsers: jest.fn(),
    findByRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'IUsersService',
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<IUsersService>('IUsersService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user and return mapped response', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(UserMapper.toResponse(mockUser));
    });
  });

  describe('findAllWithPagination', () => {
    it('should return paginated users when page and limit are provided', async () => {
      const paginationDto = new PaginationDto();
      paginationDto.page = 1;
      paginationDto.limit = 10;
      
      const paginatedResult = {
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.findAllPaginated.mockResolvedValue(paginatedResult);

      const result = await controller.findAllWithPagination(paginationDto);

      expect(usersService.findAllPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(UserMapper.toPaginatedResponse(paginatedResult));
    });

    it('should return all users when pagination parameters are not provided', async () => {
      const paginationDto = new PaginationDto();
      // Simulamos que no se proporcionan page y limit estableciendo undefined
      paginationDto.page = undefined as any;
      paginationDto.limit = undefined as any;
      
      const users = [mockUser];

      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAllWithPagination(paginationDto);

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(UserMapper.toResponseArray(users));
    });
  });

  describe('findAll', () => {
    it('should return all users as mapped responses', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(UserMapper.toResponseArray(users));
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated users as mapped response', async () => {
      const paginatedResult = {
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.findAllPaginated.mockResolvedValue(paginatedResult);

      const result = await controller.findAllPaginated(1, 10);

      expect(usersService.findAllPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(UserMapper.toPaginatedResponse(paginatedResult));
    });
  });

  describe('findActiveUsers', () => {
    it('should return active users as mapped responses', async () => {
      const users = [mockUser];
      mockUsersService.findActiveUsers.mockResolvedValue(users);

      const result = await controller.findActiveUsers();

      expect(usersService.findActiveUsers).toHaveBeenCalled();
      expect(result).toEqual(UserMapper.toResponseArray(users));
    });
  });

  describe('findByRole', () => {
    it('should return users by role as mapped responses', async () => {
      const users = [mockUser];
      mockUsersService.findByRole.mockResolvedValue(users);

      const result = await controller.findByRole('USER');

      expect(usersService.findByRole).toHaveBeenCalledWith('USER');
      expect(result).toEqual(UserMapper.toResponseArray(users));
    });
  });

  describe('findOne', () => {
    it('should return a user by id as mapped response', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('uuid-test-id');

      expect(usersService.findOne).toHaveBeenCalledWith('uuid-test-id');
      expect(result).toEqual(UserMapper.toResponse(mockUser));
    });
  });

  describe('update', () => {
    it('should update a user and return mapped response', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedUser = { 
        ...mockUser, 
        ...updateUserDto,
        hashPassword: jest.fn(),
        validatePassword: jest.fn(),
      } as any;
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('uuid-test-id', updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith('uuid-test-id', updateUserDto);
      expect(result).toEqual(UserMapper.toResponse(updatedUser));
    });
  });

  describe('remove', () => {
    it('should remove a user and return mapped delete response', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('uuid-test-id');

      expect(usersService.remove).toHaveBeenCalledWith('uuid-test-id');
      expect(result).toEqual(UserMapper.toDeleteResponse());
    });
  });
}); 