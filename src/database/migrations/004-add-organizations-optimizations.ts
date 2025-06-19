import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationsOptimizations004 implements MigrationInterface {
  name = 'AddOrganizationsOptimizations004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Índices adicionales para optimización de consultas multi-tenant
    
    // Índice para búsquedas de organizaciones por texto (búsqueda parcial en nombre)
    await queryRunner.query(`
      CREATE INDEX IDX_organizations_name_text_search 
      ON organizations USING gin(to_tsvector('spanish', name || ' ' || COALESCE(description, '')))
    `);

    // Índice para consultas de organizaciones activas ordenadas por fecha
    await queryRunner.query(`
      CREATE INDEX IDX_organizations_active_created_desc 
      ON organizations (is_active, created_at DESC) 
      WHERE is_active = true
    `);

    // Índices compuestos para la tabla organization_owners para consultas frecuentes
    
    // Índice para obtener todos los owners activos de una organización ordenados por rol
    await queryRunner.query(`
      CREATE INDEX IDX_organization_owners_org_active_role 
      ON organization_owners (organization_id, is_active, role, assigned_at DESC) 
      WHERE is_active = true
    `);

    // Índice para obtener todas las organizaciones de un usuario activo
    await queryRunner.query(`
      CREATE INDEX IDX_organization_owners_user_active_assigned 
      ON organization_owners (user_id, is_active, assigned_at DESC) 
      WHERE is_active = true
    `);

    // Índice para consultas de auditoría (quién asignó qué y cuándo)
    await queryRunner.query(`
      CREATE INDEX IDX_organization_owners_assigned_by_date 
      ON organization_owners (assigned_by, assigned_at DESC) 
      WHERE assigned_by IS NOT NULL
    `);

    // Función para actualizar automáticamente updated_at en organizations
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Trigger para actualizar updated_at automáticamente en organizations
    await queryRunner.query(`
      CREATE TRIGGER update_organizations_updated_at 
      BEFORE UPDATE ON organizations 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column()
    `);

    // Función para validar que una organización tenga al menos un owner activo
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION validate_organization_has_active_owner()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Si se está desactivando un owner, verificar que no sea el último
        IF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN
          IF (SELECT COUNT(*) FROM organization_owners 
              WHERE organization_id = NEW.organization_id 
              AND is_active = true 
              AND (organization_id, user_id) != (NEW.organization_id, NEW.user_id)) = 0 THEN
            RAISE EXCEPTION 'No se puede desactivar el último propietario activo de la organización';
          END IF;
        END IF;
        
        -- Si se está eliminando un owner, verificar que no sea el último
        IF TG_OP = 'DELETE' AND OLD.is_active = true THEN
          IF (SELECT COUNT(*) FROM organization_owners 
              WHERE organization_id = OLD.organization_id 
              AND is_active = true 
              AND (organization_id, user_id) != (OLD.organization_id, OLD.user_id)) = 0 THEN
            RAISE EXCEPTION 'No se puede eliminar el último propietario activo de la organización';
          END IF;
        END IF;
        
        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        END IF;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Trigger para validar que siempre haya al menos un owner activo
    await queryRunner.query(`
      CREATE TRIGGER validate_organization_owners 
      BEFORE UPDATE OR DELETE ON organization_owners 
      FOR EACH ROW 
      EXECUTE FUNCTION validate_organization_has_active_owner()
    `);

    // Función para llevar estadísticas básicas (opcional, para dashboards)
    await queryRunner.query(`
      CREATE OR REPLACE VIEW organization_stats AS
      SELECT 
        o.id,
        o.name,
        o.is_active,
        o.created_at,
        COUNT(oo.user_id) as total_owners,
        COUNT(CASE WHEN oo.is_active = true THEN 1 END) as active_owners,
        COUNT(CASE WHEN oo.role = 'OWNER' AND oo.is_active = true THEN 1 END) as owners_count,
        COUNT(CASE WHEN oo.role = 'ADMIN' AND oo.is_active = true THEN 1 END) as admins_count,
        COUNT(CASE WHEN oo.role = 'MEMBER' AND oo.is_active = true THEN 1 END) as members_count,
        MAX(oo.assigned_at) as last_assignment_date
      FROM organizations o
      LEFT JOIN organization_owners oo ON o.id = oo.organization_id
      GROUP BY o.id, o.name, o.is_active, o.created_at
    `);

    // Agregar comentarios para documentación
    await queryRunner.query(`
      COMMENT ON FUNCTION update_updated_at_column() IS 'Función para actualizar automáticamente la columna updated_at'
    `);
    
    await queryRunner.query(`
      COMMENT ON FUNCTION validate_organization_has_active_owner() IS 'Función que valida que una organización siempre tenga al menos un propietario activo'
    `);
    
    await queryRunner.query(`
      COMMENT ON VIEW organization_stats IS 'Vista con estadísticas básicas de organizaciones y sus propietarios'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar vista y funciones
    await queryRunner.query(`DROP VIEW IF EXISTS organization_stats`);
    
    // Eliminar triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS validate_organization_owners ON organization_owners`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations`);
    
    // Eliminar funciones
    await queryRunner.query(`DROP FUNCTION IF EXISTS validate_organization_has_active_owner()`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);
    
    // Eliminar índices adicionales
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_organization_owners_assigned_by_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_organization_owners_user_active_assigned`);
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_organization_owners_org_active_role`);
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_organizations_active_created_desc`);
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_organizations_name_text_search`);
  }
} 