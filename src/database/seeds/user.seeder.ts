import { Injectable, Inject } from '@nestjs/common';
import { UserFactory } from '../factories/user.factory';
import { UserRole } from '../../common/enums/user-role.enum';
import { UsersService } from '../../modules/users/services/users.service';

@Injectable()
export class UserSeeder {
  constructor(private readonly usersService: UsersService) {}

  async run(): Promise<void> {
    console.log('Iniciando seeder de usuarios...');

    try {
      // Crear usuario administrador
      const adminData = {
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      };
      
      const admin = await this.usersService.create(adminData);
      console.log(`✅ Admin creado: ${admin.email}`);

      // Crear algunos usuarios regulares
      for (let i = 1; i <= 5; i++) {
        const userData = {
          email: `user${i}@example.com`,
          password: 'password123',
          firstName: `User${i}`,
          lastName: 'Test',
          role: UserRole.USER,
        };
        
        const user = await this.usersService.create(userData);
        console.log(`✅ Usuario creado: ${user.email}`);
      }

      // Crear algunos moderadores
      for (let i = 1; i <= 2; i++) {
        const modData = {
          email: `moderator${i}@example.com`,
          password: 'password123',
          firstName: `Moderator${i}`,
          lastName: 'Test',
          role: UserRole.MODERATOR,
        };
        
        const mod = await this.usersService.create(modData);
        console.log(`✅ Moderador creado: ${mod.email}`);
      }

      console.log('✅ Seeder de usuarios completado exitosamente');
      console.log(`📊 Total: 1 admin, 5 usuarios, 2 moderadores`);

    } catch (error) {
      console.error('❌ Error en seeder:', error.message);
    }
  }
} 