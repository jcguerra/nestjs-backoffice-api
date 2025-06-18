import { Module } from '@nestjs/common';
import { UserSeeder } from './seeds/user.seeder';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [UserSeeder],
  exports: [UserSeeder],
})
export class DatabaseModule {} 