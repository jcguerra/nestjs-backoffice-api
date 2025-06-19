/**
 * Configuración del módulo Organizations
 * 
 * Contiene constantes, configuraciones por defecto y tokens de inyección
 * para el módulo de organizaciones multi-tenant.
 */

// ========== TOKENS DE INYECCIÓN DE DEPENDENCIAS ==========

export const ORGANIZATION_TOKENS = {
  // Repositorios
  ORGANIZATION_REPOSITORY: 'IOrganizationRepository',
  ORGANIZATION_OWNER_REPOSITORY: 'IOrganizationOwnerRepository',
  
  // Servicios
  ORGANIZATIONS_SERVICE: 'IOrganizationsService',
  ORGANIZATION_OWNERS_SERVICE: 'IOrganizationOwnersService',
} as const;

// ========== CONFIGURACIÓN DE ROLES ==========

export const ORGANIZATION_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
  EDITOR: 'EDITOR',
  MODERATOR: 'MODERATOR',
} as const;

export type OrganizationRole = typeof ORGANIZATION_ROLES[keyof typeof ORGANIZATION_ROLES];

// Jerarquía de roles (de mayor a menor privilegio)
export const ROLE_HIERARCHY: OrganizationRole[] = [
  ORGANIZATION_ROLES.OWNER,
  ORGANIZATION_ROLES.ADMIN,
  ORGANIZATION_ROLES.MODERATOR,
  ORGANIZATION_ROLES.EDITOR,
  ORGANIZATION_ROLES.MEMBER,
  ORGANIZATION_ROLES.VIEWER,
];

// ========== CONFIGURACIÓN DE PAGINACIÓN ==========

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// ========== CONFIGURACIÓN DE VALIDACIONES ==========

export const VALIDATION_CONFIG = {
  ORGANIZATION_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  ORGANIZATION_DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  OWNERS: {
    MIN_REQUIRED: 1,
    MAX_PER_ORGANIZATION: 50,
  },
} as const;

// ========== MENSAJES DE ERROR ==========

export const ERROR_MESSAGES = {
  ORGANIZATION_NOT_FOUND: 'Organización no encontrada',
  ORGANIZATION_INACTIVE: 'La organización no está activa',
  ORGANIZATION_NAME_EXISTS: 'Ya existe una organización con este nombre',
  
  OWNER_NOT_FOUND: 'Propietario no encontrado',
  OWNER_ALREADY_EXISTS: 'El usuario ya es propietario de esta organización',
  OWNER_NOT_ACTIVE: 'El propietario no está activo',
  CANNOT_REMOVE_LAST_OWNER: 'No se puede eliminar el último propietario',
  
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_NOT_OWNER: 'El usuario no es propietario de esta organización',
  USER_INACTIVE: 'El usuario no está activo',
  
  INVALID_ROLE: 'Rol inválido',
  INSUFFICIENT_PERMISSIONS: 'Permisos insuficientes',
  INVALID_UUID: 'ID inválido',
  
  PAGINATION_INVALID: 'Parámetros de paginación inválidos',
} as const;

// ========== CONFIGURACIÓN DE MIDDLEWARE ==========

export const MIDDLEWARE_CONFIG = {
  CONTEXT_ROUTES: [
    '*/organizations/:organizationId',
    '*/organizations/:organizationId/*',
  ],
  UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

// ========== CONFIGURACIÓN DE GUARDS ==========

export const GUARD_CONFIG = {
  DEFAULT_ACTIVE_ONLY: true,
  CACHE_TTL_SECONDS: 300, // 5 minutos
  MAX_ROLE_CHECK_DEPTH: 3,
} as const;

// ========== FUNCIONES UTILITARIAS ==========

/**
 * Verifica si un rol tiene mayor o igual privilegio que otro
 */
export function hasRolePrivilege(userRole: OrganizationRole, requiredRole: OrganizationRole): boolean {
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  // Si algún rol no está en la jerarquía, denegar acceso
  if (userIndex === -1 || requiredIndex === -1) {
    return false;
  }
  
  // Menor índice = mayor privilegio
  return userIndex <= requiredIndex;
}

/**
 * Obtiene todos los roles con menor o igual privilegio
 */
export function getRolesWithLowerPrivilege(role: OrganizationRole): OrganizationRole[] {
  const roleIndex = ROLE_HIERARCHY.indexOf(role);
  
  if (roleIndex === -1) {
    return [];
  }
  
  return ROLE_HIERARCHY.slice(roleIndex);
}

/**
 * Valida si un UUID es válido
 */
export function isValidUUID(uuid: string): boolean {
  return MIDDLEWARE_CONFIG.UUID_REGEX.test(uuid);
}

/**
 * Valida parámetros de paginación
 */
export function validatePagination(page?: number, limit?: number): { page: number; limit: number } {
  const validatedPage = Math.max(page || PAGINATION_CONFIG.DEFAULT_PAGE, 1);
  const validatedLimit = Math.min(
    Math.max(limit || PAGINATION_CONFIG.DEFAULT_LIMIT, PAGINATION_CONFIG.MIN_LIMIT),
    PAGINATION_CONFIG.MAX_LIMIT
  );
  
  return { page: validatedPage, limit: validatedLimit };
}

/**
 * Configuración por defecto para el módulo
 */
export const ORGANIZATIONS_MODULE_CONFIG = {
  tokens: ORGANIZATION_TOKENS,
  roles: ORGANIZATION_ROLES,
  pagination: PAGINATION_CONFIG,
  validation: VALIDATION_CONFIG,
  messages: ERROR_MESSAGES,
  middleware: MIDDLEWARE_CONFIG,
  guards: GUARD_CONFIG,
} as const; 