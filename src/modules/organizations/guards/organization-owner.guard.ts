import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException, Inject } from '@nestjs/common';
import { IOrganizationOwnersService } from '../interfaces/organization-owners-service.interface';
import { User } from '../../users/entities/user.entity';

/**
 * Guard que verifica si el usuario autenticado es propietario de la organización especificada
 * 
 * Uso:
 * - @UseGuards(JwtAuthGuard, OrganizationOwnerGuard)
 * - Requiere que la ruta tenga un parámetro :organizationId
 * - Requiere que el usuario esté autenticado (usar después de JwtAuthGuard)
 */
@Injectable()
export class OrganizationOwnerGuard implements CanActivate {
  constructor(
    @Inject('IOrganizationOwnersService')
    private readonly organizationOwnersService: IOrganizationOwnersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
      const isOwner = await this.organizationOwnersService.isActiveOwner(organizationId, user.id);
      
      if (!isOwner) {
        throw new ForbiddenException('No tienes permisos para acceder a esta organización');
      }

      return true;
    } catch (error) {
      // Si el error ya es una excepción HTTP, relanzarla
      if (error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Para cualquier otro error (ej: organización no existe), denegar acceso
      throw new ForbiddenException('Acceso denegado a la organización');
    }
  }
} 