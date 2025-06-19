import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
    {
      provide: 'IUsersService',
      useExisting: UsersService,
    },
  ],
  exports: [UsersService, UserRepository, 'IUserRepository', 'IUsersService'],
})
export class UsersModule {} 