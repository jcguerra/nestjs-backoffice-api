import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOne(conditions: Partial<User>): Promise<User | null> {
    return this.userRepository.findOne({ where: conditions as any });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('Usuario no encontrado');
    }
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(conditions?: Partial<User>): Promise<number> {
    return this.userRepository.count({ where: conditions as any });
  }

  async exists(conditions: Partial<User>): Promise<boolean> {
    const count = await this.userRepository.count({ where: conditions as any });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { isActive: true } });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.userRepository.find({ where: { role: role as any } });
  }
} 