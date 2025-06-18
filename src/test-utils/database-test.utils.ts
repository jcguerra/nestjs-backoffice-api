import { Repository, DataSource, ObjectLiteral } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

export class DatabaseTestUtils {
  constructor(private dataSource: DataSource) {}

  /**
   * Limpia todas las tablas de la base de datos
   */
  async cleanDatabase(): Promise<void> {
    const entities = this.dataSource.entityMetadatas;
    
    // Desactivar restricciones de foreign key temporalmente
    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Limpiar cada tabla
    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.clear();
    }
    
    // Reactivar restricciones de foreign key
    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  /**
   * Reinicia las secuencias AUTO_INCREMENT de todas las tablas
   */
  async resetSequences(): Promise<void> {
    const entities = this.dataSource.entityMetadatas;
    
    for (const entity of entities) {
      if (entity.primaryColumns.length > 0) {
        const tableName = entity.tableName;
        await this.dataSource.query(`ALTER SEQUENCE IF EXISTS ${tableName}_id_seq RESTART WITH 1`);
      }
    }
  }

  /**
   * Crea un usuario de prueba
   */
  async createTestUser(
    userRepository: Repository<User>,
    overrides: Partial<User> = {},
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const defaultUser = {
      email: `test-${Date.now()}@example.com`,
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      isActive: true,
    };

    const user = userRepository.create({
      ...defaultUser,
      ...overrides,
    });

    return userRepository.save(user);
  }

  /**
   * Crea un usuario administrador de prueba
   */
  async createTestAdmin(
    userRepository: Repository<User>,
    overrides: Partial<User> = {},
  ): Promise<User> {
    return this.createTestUser(userRepository, {
      email: `admin-${Date.now()}@example.com`,
      role: UserRole.ADMIN,
      ...overrides,
    });
  }

  /**
   * Crea múltiples usuarios de prueba
   */
  async createTestUsers(
    userRepository: Repository<User>,
    count: number,
    role: UserRole = UserRole.USER,
  ): Promise<User[]> {
    const users: User[] = [];
    
    for (let i = 0; i < count; i++) {
      const user = await this.createTestUser(userRepository, {
        email: `test-user-${i}-${Date.now()}@example.com`,
        firstName: `Test${i}`,
        lastName: `User${i}`,
        role,
      });
      users.push(user);
    }
    
    return users;
  }

  /**
   * Obtiene el repositorio de una entidad
   */
  getRepository<T extends ObjectLiteral>(entity: any): Repository<T> {
    return this.dataSource.getRepository(entity) as Repository<T>;
  }

  /**
   * Verifica si una tabla existe en la base de datos
   */
  async tableExists(tableName: string): Promise<boolean> {
    const result = await this.dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `, [tableName]);
    
    return result[0]?.exists || false;
  }

  /**
   * Obtiene el número de registros en una tabla
   */
  async getRecordCount(tableName: string): Promise<number> {
    const result = await this.dataSource.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return parseInt(result[0]?.count || '0', 10);
  }

  /**
   * Ejecuta una consulta SQL personalizada
   */
  async executeQuery(query: string, parameters?: any[]): Promise<any> {
    return this.dataSource.query(query, parameters);
  }
}

/**
 * Factory para crear instancia de DatabaseTestUtils
 */
export const createDatabaseTestUtils = (dataSource: DataSource): DatabaseTestUtils => {
  return new DatabaseTestUtils(dataSource);
};

/**
 * Configuración de base de datos para tests unitarios con SQLite en memoria
 */
export const createInMemoryDatabase = async (): Promise<DataSource> => {
  const { DataSource: TypeOrmDataSource } = await import('typeorm');
  
  const dataSource = new TypeOrmDataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}; 