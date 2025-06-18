import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UserSeeder } from './user.seeder';

async function runSeeders() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    console.log('🌱 Iniciando seeders...');
    
    // Ejecutar seeder de usuarios
    const userSeeder = app.get(UserSeeder);
    await userSeeder.run();
    
    console.log('✅ Seeders ejecutados exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
  } finally {
    await app.close();
  }
}

runSeeders(); 