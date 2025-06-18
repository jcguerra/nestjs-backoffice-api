import { BaseRepositoryInterface } from '../../../common/interfaces/base-repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends BaseRepositoryInterface<User> {
  findByEmail(email: string): Promise<User | null>;
  findActiveUsers(): Promise<User[]>;
  findByRole(role: string): Promise<User[]>;
} 