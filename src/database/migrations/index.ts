/**
 * Índice de migraciones de base de datos
 * 
 * Este archivo exporta todas las migraciones disponibles
 * para facilitar su importación y uso en scripts.
 */

// Migraciones base del sistema
import { CreateUsersTable001 } from './001-create-users-table';

// Migraciones del módulo Organizations
import { CreateOrganizationsTable002 } from './002-create-organizations-table';
import { CreateOrganizationOwnersTable003 } from './003-create-organization-owners-table';
import { AddOrganizationsOptimizations004 } from './004-add-organizations-optimizations';

// Re-exportar para uso externo
export { CreateUsersTable001 } from './001-create-users-table';
export { CreateOrganizationsTable002 } from './002-create-organizations-table';
export { CreateOrganizationOwnersTable003 } from './003-create-organization-owners-table';
export { AddOrganizationsOptimizations004 } from './004-add-organizations-optimizations';

/**
 * Array con todas las migraciones en orden de ejecución
 */
export const ALL_MIGRATIONS = [
  CreateUsersTable001,
  CreateOrganizationsTable002,
  CreateOrganizationOwnersTable003,
  AddOrganizationsOptimizations004,
];

/**
 * Array con solo las migraciones del módulo Organizations
 */
export const ORGANIZATIONS_MIGRATIONS = [
  CreateOrganizationsTable002,
  CreateOrganizationOwnersTable003,
  AddOrganizationsOptimizations004,
];

/**
 * Metadata de las migraciones
 */
export const MIGRATION_METADATA = {
  total: ALL_MIGRATIONS.length,
  organizationsCount: ORGANIZATIONS_MIGRATIONS.length,
  lastMigrationNumber: 4,
  modules: {
    users: [CreateUsersTable001],
    organizations: ORGANIZATIONS_MIGRATIONS,
  },
} as const; 