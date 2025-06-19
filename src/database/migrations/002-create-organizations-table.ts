import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateOrganizationsTable002 implements MigrationInterface {
  name = 'CreateOrganizationsTable002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Asegurar que la extensión uuid-ossp esté disponible
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    
    await queryRunner.createTable(
      new Table({
        name: 'organizations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'IDX_organizations_name',
            columnNames: ['name'],
            isUnique: true,
          },
          {
            name: 'IDX_organizations_active',
            columnNames: ['is_active'],
          },
          {
            name: 'IDX_organizations_created_at',
            columnNames: ['created_at'],
          },
        ],
      }),
      true,
    );

    // Agregar comentarios a la tabla y columnas para documentación
    await queryRunner.query(`
      COMMENT ON TABLE organizations IS 'Tabla de organizaciones para el sistema multi-tenant'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organizations.id IS 'Identificador único de la organización'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organizations.name IS 'Nombre único de la organización (3-100 caracteres)'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organizations.description IS 'Descripción opcional de la organización (máximo 500 caracteres)'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organizations.is_active IS 'Estado activo/inactivo de la organización'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organizations');
  }
} 