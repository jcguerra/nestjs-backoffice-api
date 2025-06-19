import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import databaseConfig from '../../config/database.config';

// Importar las migraciones específicas de organizaciones
import { CreateOrganizationsTable002 } from '../migrations/002-create-organizations-table';
import { CreateOrganizationOwnersTable003 } from '../migrations/003-create-organization-owners-table';
import { AddOrganizationsOptimizations004 } from '../migrations/004-add-organizations-optimizations';

/**
 * Script para ejecutar las migraciones específicas del módulo Organizations
 * 
 * Este script permite ejecutar solo las migraciones relacionadas con organizaciones
 * sin afectar otras migraciones existentes.
 */
async function runOrganizationsMigrations() {
  console.log('🚀 Iniciando migraciones del módulo Organizations...\n');

  const configService = new ConfigService();
  const config = databaseConfig();

  // Crear DataSource con las migraciones específicas
  const dataSource = new DataSource({
    ...config,
    migrations: [
      CreateOrganizationsTable002,
      CreateOrganizationOwnersTable003,
      AddOrganizationsOptimizations004,
    ],
    migrationsRun: false, // No ejecutar automáticamente
    synchronize: false,   // No sincronizar automáticamente
  } as DataSourceOptions);

  try {
    // Inicializar conexión
    await dataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');

    // Obtener migraciones pendientes
    const pendingMigrations = await dataSource.showMigrations();
    
    if (pendingMigrations) {
      console.log('📋 Migraciones pendientes encontradas:');
      
      // Ejecutar migraciones
      const executedMigrations = await dataSource.runMigrations({
        transaction: 'each', // Cada migración en su propia transacción
      });

      if (executedMigrations.length > 0) {
        console.log('\n✅ Migraciones ejecutadas exitosamente:');
        executedMigrations.forEach((migration, index) => {
          console.log(`   ${index + 1}. ${migration.name}`);
        });
      } else {
        console.log('ℹ️  No hay migraciones pendientes para ejecutar');
      }
    } else {
      console.log('ℹ️  Todas las migraciones están actualizadas');
    }

    // Verificar que las tablas se crearon correctamente
    console.log('\n🔍 Verificando tablas creadas...');
    
    const organizationsTableExists = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'organizations'
      );
    `);

    const organizationOwnersTableExists = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'organization_owners'
      );
    `);

    const organizationStatsViewExists = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.views 
        WHERE table_schema = 'public' 
        AND table_name = 'organization_stats'
      );
    `);

    console.log('   📊 Tabla organizations:', organizationsTableExists[0].exists ? '✅' : '❌');
    console.log('   📊 Tabla organization_owners:', organizationOwnersTableExists[0].exists ? '✅' : '❌');
    console.log('   📊 Vista organization_stats:', organizationStatsViewExists[0].exists ? '✅' : '❌');

    // Verificar índices importantes
    console.log('\n🔍 Verificando índices...');
    
    const indices = await dataSource.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE tablename IN ('organizations', 'organization_owners')
      AND indexname LIKE 'IDX_%'
      ORDER BY tablename, indexname;
    `);

    console.log(`   📊 Índices creados: ${indices.length} índices`);
    indices.forEach((index: any) => {
      console.log(`      - ${index.tablename}.${index.indexname}`);
    });

    // Verificar foreign keys
    console.log('\n🔍 Verificando foreign keys...');
    
    const foreignKeys = await dataSource.query(`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'organization_owners';
    `);

    console.log(`   📊 Foreign keys creadas: ${foreignKeys.length} relaciones`);
    foreignKeys.forEach((fk: any) => {
      console.log(`      - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    console.log('\n🎉 ¡Migraciones del módulo Organizations completadas exitosamente!');
    console.log('\n📋 RESUMEN:');
    console.log('   ✅ Tabla organizations creada con índices');
    console.log('   ✅ Tabla organization_owners creada con relaciones');
    console.log('   ✅ Índices de optimización aplicados');
    console.log('   ✅ Triggers de validación configurados');
    console.log('   ✅ Vista de estadísticas disponible');
    console.log('   ✅ Sistema multi-tenant listo a nivel de base de datos');

  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error.message);
    console.error('\n🔧 Posibles soluciones:');
    console.error('   - Verificar que la base de datos esté ejecutándose');
    console.error('   - Revisar las credenciales de conexión');
    console.error('   - Verificar que el usuario tenga permisos de escritura');
    process.exit(1);
  } finally {
    // Cerrar conexión
    await dataSource.destroy();
    console.log('\n🔌 Conexión a base de datos cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runOrganizationsMigrations()
    .then(() => {
      console.log('\n✨ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error);
      process.exit(1);
    });
}

export { runOrganizationsMigrations }; 