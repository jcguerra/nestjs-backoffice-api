import { SetMetadata } from '@nestjs/common';
import { ORGANIZATION_ROLES_KEY } from '../guards/organization-role.guard';

/**
 * Decorador para especificar los roles requeridos dentro de una organización
 * 
 * @param roles - Array de roles que pueden acceder al endpoint
 * 
 * Ejemplo de uso:
 * ```typescript
 * @OrganizationRoles(['OWNER', 'ADMIN'])
 * @UseGuards(JwtAuthGuard, OrganizationRoleGuard)
 * async updateOrganization() {
 *   // Solo usuarios con rol OWNER o ADMIN pueden ejecutar esta acción
 * }
 * ```
 * 
 * Roles típicos en organizaciones:
 * - 'OWNER': Propietario principal con todos los permisos
 * - 'ADMIN': Administrador con permisos de gestión
 * - 'MEMBER': Miembro con permisos limitados
 * - 'VIEWER': Solo lectura
 */
export const OrganizationRoles = (roles: string[]) => SetMetadata(ORGANIZATION_ROLES_KEY, roles); 