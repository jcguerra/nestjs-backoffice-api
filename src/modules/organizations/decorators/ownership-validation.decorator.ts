import { SetMetadata } from '@nestjs/common';
import { OwnershipConfig, OWNERSHIP_CONFIG_KEY, OwnershipValidationType } from '../guards/organization-ownership.guard';

/**
 * Decorador para configurar validaciones de ownership en organizaciones
 * 
 * @param config - Configuración de la validación de ownership
 * 
 * Ejemplos de uso:
 * 
 * ```typescript
 * // Solo propietarios activos
 * @OwnershipValidation({ type: 'ACTIVE_OWNER' })
 * @UseGuards(JwtAuthGuard, OrganizationOwnershipGuard)
 * async deleteOrganization() { }
 * 
 * // Admins o propietarios
 * @OwnershipValidation({ type: 'ADMIN_OR_OWNER' })
 * @UseGuards(JwtAuthGuard, OrganizationOwnershipGuard)
 * async updateSettings() { }
 * 
 * // Solo role OWNER
 * @OwnershipValidation({ type: 'OWNER_ONLY' })
 * @UseGuards(JwtAuthGuard, OrganizationOwnershipGuard)
 * async transferOwnership() { }
 * 
 * // Cualquier miembro o superior
 * @OwnershipValidation({ type: 'MEMBER_OR_ABOVE' })
 * @UseGuards(JwtAuthGuard, OrganizationOwnershipGuard)
 * async viewData() { }
 * 
 * // Roles personalizados
 * @OwnershipValidation({ 
 *   type: 'CUSTOM', 
 *   allowedRoles: ['EDITOR', 'ADMIN', 'OWNER'],
 *   message: 'Solo editores y superiores pueden realizar esta acción'
 * })
 * @UseGuards(JwtAuthGuard, OrganizationOwnershipGuard)
 * async editContent() { }
 * ```
 */
export const OwnershipValidation = (config: OwnershipConfig) => SetMetadata(OWNERSHIP_CONFIG_KEY, config);

/**
 * Decoradores de conveniencia para casos comunes
 */

/**
 * Requiere que el usuario sea propietario activo de la organización
 */
export const RequireActiveOwner = () => OwnershipValidation({ type: 'ACTIVE_OWNER' });

/**
 * Requiere que el usuario tenga rol de ADMIN o OWNER
 */
export const RequireAdminOrOwner = () => OwnershipValidation({ type: 'ADMIN_OR_OWNER' });

/**
 * Requiere que el usuario tenga rol de OWNER únicamente
 */
export const RequireOwnerOnly = () => OwnershipValidation({ type: 'OWNER_ONLY' });

/**
 * Requiere que el usuario sea miembro de la organización (cualquier rol)
 */
export const RequireMember = () => OwnershipValidation({ type: 'MEMBER_OR_ABOVE' });

/**
 * Crear validación personalizada con roles específicos
 */
export const RequireRoles = (roles: string[], message?: string) => 
  OwnershipValidation({ 
    type: 'CUSTOM', 
    allowedRoles: roles,
    ...(message && { message })
  }); 