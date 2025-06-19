import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IOrganizationOwnersService } from '../interfaces/organization-owners-service.interface';
import { User } from '../../users/entities/user.entity';

// Clave para el decorador de roles de organización
export const ORGANIZATION_ROLES_KEY = 'organizationRoles';

/**
 * Guard que verifica si el usuario autenticado tiene uno de los roles requeridos en la organización
 * 
 * Uso:
 * - @UseGuards(JwtAuthGuard, OrganizationRoleGuard)
 * - @OrganizationRoles(['OWNER', 'ADMIN'])
 * - Requiere que la ruta tenga un parámetro :organizationId
 * - Requiere que el usuario esté autenticado (usar después de JwtAuthGuard)
 */
@Injectable()
export class OrganizationRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('IOrganizationOwnersService')
    private readonly organizationOwnersService: IOrganizationOwnersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener los roles requeridos del decorador
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ORGANIZATION_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const organizationId: string = request.params.organizationId;

    // Verificar que el usuario esté autenticado
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Verificar que existe el parámetro organizationId
    if (!organizationId) {
      throw new BadRequestException('ID de organización requerido en la ruta');
    }

    try {
      // Verificar si el usuario es propietario activo de la organización
      const isActiveOwner = await this.organizationOwnersService.isActiveOwner(organizationId, user.id);
      
      if (!isActiveOwner) {
        throw new ForbiddenException('No eres propietario de esta organización');
      }

      // Obtener todos los owners de la organización para encontrar el rol del usuario
      const owners = await this.organizationOwnersService.getActiveOwners(organizationId);
      const userOwnership = owners.find(owner => owner.userId === user.id);

      if (!userOwnership) {
        throw new ForbiddenException('No tienes permisos en esta organización');
      }

      // Verificar si el rol del usuario está en la lista de roles requeridos
      const hasRequiredRole = requiredRoles.includes(userOwnership.role);
      
      if (!hasRequiredRole) {
        throw new ForbiddenException(
          `Rol insuficiente. Se requiere uno de: ${requiredRoles.join(', ')}. Tu rol actual: ${userOwnership.role}`
        );
      }

      // Agregar información del ownership al request para uso posterior
      request.userOwnership = userOwnership;

      return true;
    } catch (error) {
      // Si el error ya es una excepción HTTP, relanzarla
      if (error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Para cualquier otro error, denegar acceso
      throw new ForbiddenException('Error al verificar permisos de organización');
    }
  }
} 