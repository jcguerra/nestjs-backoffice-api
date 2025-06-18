import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    const defaultUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: `user${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new User({ ...defaultUser, ...overrides });
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        ...overrides,
        email: `user${Date.now()}_${index}@example.com`,
      })
    );
  }

  static createAdmin(overrides: Partial<User> = {}): User {
    return this.create({
      role: UserRole.ADMIN,
      ...overrides,
    });
  }
} 