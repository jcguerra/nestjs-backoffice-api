import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IUsersService } from '../interfaces/users-service.interface';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está en uso');
    }

    return this.userRepository.create({
      ...createUserDto,
      isActive: true,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findAllPaginated(page: number, limit: number): Promise<PaginatedResult<User>> {
    const users = await this.userRepository.findAll();
    const total = users.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = users.slice(offset, offset + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Esto validará que el usuario existe
    
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id); // Esto validará que el usuario existe
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Error al eliminar el usuario');
    }
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.findActiveUsers();
  }

  async findByRole(role: string): Promise<User[]> {
    return this.userRepository.findByRole(role);
  }
} 