import { Repository } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

export class TestUtils {
  static async createTestUser(
    userRepository: Repository<User>,
    overrides: Partial<User> = {},
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = userRepository.create({
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      isActive: true,
      ...overrides,
    });

    return userRepository.save(user);
  }

  static async createTestAdmin(
    userRepository: Repository<User>,
    overrides: Partial<User> = {},
  ): Promise<User> {
    return this.createTestUser(userRepository, {
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      ...overrides,
    });
  }

  static async clearDatabase(repositories: Repository<any>[]): Promise<void> {
    const deletePromises = repositories.map(repo => repo.clear());
    await Promise.all(deletePromises);
  }

  static generateMockJwtPayload(user: Partial<User>) {
    return {
      email: user.email,
      sub: user.id,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    };
  }
} 