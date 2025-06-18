import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTestDatabaseConfig = (configService?: ConfigService): TypeOrmModuleOptions => {
  const isE2E = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'e2e';
  
  return {
    type: 'postgres',
    host: configService?.get('DB_HOST', 'localhost') || 'localhost',
    port: configService?.get('DB_PORT', 5433) || 5433,
    username: configService?.get('DB_USERNAME', 'postgres') || 'postgres',
    password: configService?.get('DB_PASSWORD', 'postgres123') || 'postgres123',
    database: isE2E 
      ? `${configService?.get('DB_NAME', 'nestjs_backoffice') || 'nestjs_backoffice'}_test_e2e`
      : `${configService?.get('DB_NAME', 'nestjs_backoffice') || 'nestjs_backoffice'}_test`,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // Para tests, creamos el schema automáticamente
    dropSchema: true, // Limpia la DB antes de cada test suite
    logging: false, // Deshabilitamos logs en tests para mejor rendimiento
    migrationsRun: false, // No ejecutamos migraciones en tests
  };
};

// Configuración alternativa para tests unitarios con base de datos en memoria
export const getInMemoryTestDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: ':memory:',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
  logging: false,
}); 