import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateOrganizationOwnersTable003 implements MigrationInterface {
  name = 'CreateOrganizationOwnersTable003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organization_owners',
        columns: [
          {
            name: 'organization_id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER', 'EDITOR', 'MODERATOR'],
            default: "'OWNER'",
            isNullable: false,
          },
          {
            name: 'assigned_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'assigned_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'IDX_organization_owners_organization_id',
            columnNames: ['organization_id'],
          },
          {
            name: 'IDX_organization_owners_user_id',
            columnNames: ['user_id'],
          },
          {
            name: 'IDX_organization_owners_role',
            columnNames: ['role'],
          },
          {
            name: 'IDX_organization_owners_active',
            columnNames: ['is_active'],
          },
          {
            name: 'IDX_organization_owners_assigned_at',
            columnNames: ['assigned_at'],
          },
          {
            name: 'IDX_organization_owners_org_user_active',
            columnNames: ['organization_id', 'user_id', 'is_active'],
          },
          {
            name: 'IDX_organization_owners_org_role_active',
            columnNames: ['organization_id', 'role', 'is_active'],
          },
        ],
      }),
      true,
    );

    // Crear foreign keys para mantener integridad referencial
    await queryRunner.createForeignKey(
      'organization_owners',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE', // Si se elimina la organización, se eliminan todos sus owners
        onUpdate: 'CASCADE',
        name: 'FK_organization_owners_organization_id',
      }),
    );

    await queryRunner.createForeignKey(
      'organization_owners',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan todos sus ownerships
        onUpdate: 'CASCADE',
        name: 'FK_organization_owners_user_id',
      }),
    );

    await queryRunner.createForeignKey(
      'organization_owners',
      new TableForeignKey({
        columnNames: ['assigned_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL', // Si se elimina el usuario que asignó, se pone en NULL
        onUpdate: 'CASCADE',
        name: 'FK_organization_owners_assigned_by',
      }),
    );

    // Agregar comentarios para documentación
    await queryRunner.query(`
      COMMENT ON TABLE organization_owners IS 'Tabla pivot que relaciona usuarios con organizaciones (sistema multi-tenant)'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organization_owners.organization_id IS 'ID de la organización (FK)'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organization_owners.user_id IS 'ID del usuario propietario (FK)'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organization_owners.role IS 'Rol del usuario en la organización'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organization_owners.assigned_at IS 'Fecha y hora de asignación del ownership'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organization_owners.assigned_by IS 'ID del usuario que asignó el ownership (FK, nullable)'
    `);
    
    await queryRunner.query(`
      COMMENT ON COLUMN organization_owners.is_active IS 'Estado activo/inactivo del ownership (soft delete)'
    `);

    // Crear constraint para evitar duplicados activos
    await queryRunner.query(`
      CREATE UNIQUE INDEX IDX_organization_owners_unique_active 
      ON organization_owners (organization_id, user_id) 
      WHERE is_active = true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys primero
    await queryRunner.dropForeignKey('organization_owners', 'FK_organization_owners_assigned_by');
    await queryRunner.dropForeignKey('organization_owners', 'FK_organization_owners_user_id');
    await queryRunner.dropForeignKey('organization_owners', 'FK_organization_owners_organization_id');
    
    // Eliminar la tabla
    await queryRunner.dropTable('organization_owners');
  }
} 