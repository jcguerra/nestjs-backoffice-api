import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findAllPaginated(page: number, limit: number): Promise<PaginatedResult<User>>;
  findOne(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<void>;
  findActiveUsers(): Promise<User[]>;
  findByRole(role: string): Promise<User[]>;
} 