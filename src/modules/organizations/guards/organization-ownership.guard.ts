import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IOrganizationOwnersService } from '../interfaces/organization-owners-service.interface';
import { User } from '../../users/entities/user.entity';

// Tipos de validación de ownership
export type OwnershipValidationType = 
  | 'OWNER' // Cualquier tipo de propietario (activo o inactivo)
  | 'ACTIVE_OWNER' // Solo propietarios activos
  | 'ADMIN_OR_OWNER' // Roles ADMIN o OWNER
  | 'OWNER_ONLY' // Solo rol OWNER
  | 'MEMBER_OR_ABOVE' // Cualquier propietario (MEMBER, ADMIN, OWNER)
  | 'CUSTOM'; // Validación personalizada

// Configuración del decorador
export interface OwnershipConfig {
  type: OwnershipValidationType;
  allowedRoles?: string[]; // Para tipo CUSTOM
  requireActive?: boolean; // Si requiere propietario activo
  allowSelf?: boolean; // Si permite operaciones sobre uno mismo
  message?: string; // Mensaje de error personalizado
}

// Clave para el decorador
export const OWNERSHIP_CONFIG_KEY = 'ownershipConfig';

/**
 * Guard avanzado para validaciones de ownership en organizaciones
 * 
 * Funcionalidades:
 * - Validación flexible de diferentes tipos de ownership
 * - Verificación de roles específicos
 * - Validación de estado activo/inactivo
 * - Validación de operaciones sobre uno mismo
 * - Mensajes de error personalizables
 * 
 * Uso con decorador:
 * @OwnershipValidation({ type: 'ADMIN_OR_OWNER' })
 * @UseGuards(JwtAuthGuard, OrganizationOwnershipGuard)
 */
@Injectable()
export class OrganizationOwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('IOrganizationOwnersService')
    private readonly organizationOwnersService: IOrganizationOwnersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener configuración del decorador
    const config = this.reflector.getAllAndOverride<OwnershipConfig>(OWNERSHIP_CONFIG_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay configuración, permitir acceso (para compatibilidad)
    if (!config) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const organizationId: string = request.params.organizationId;
    const targetUserId: string = request.params.userId; // Para operaciones sobre usuarios específicos

    // Verificaciones básicas
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (!organizationId) {
      throw new BadRequestException('ID de organización requerido en la ruta');
    }

    try {
      // Realizar validación según el tipo configurado
      const isValid = await this.validateOwnership(config, organizationId, user.id, targetUserId);
      
      if (!isValid) {
        const message = config.message || this.getDefaultErrorMessage(config.type);
        throw new ForbiddenException(message);
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new ForbiddenException('Error al verificar permisos de ownership');
    }
  }

  /**
   * Realiza la validación de ownership según la configuración
   */
  private async validateOwnership(
    config: OwnershipConfig, 
    organizationId: string, 
    userId: string, 
    targetUserId?: string
  ): Promise<boolean> {
    switch (config.type) {
      case 'OWNER':
        return await this.organizationOwnersService.isOwner(organizationId, userId);

      case 'ACTIVE_OWNER':
        return await this.organizationOwnersService.isActiveOwner(organizationId, userId);

      case 'ADMIN_OR_OWNER':
        return await this.validateRoles(organizationId, userId, ['ADMIN', 'OWNER'], config.requireActive);

      case 'OWNER_ONLY':
        return await this.validateRoles(organizationId, userId, ['OWNER'], config.requireActive);

      case 'MEMBER_OR_ABOVE':
        return await this.validateRoles(organizationId, userId, ['MEMBER', 'ADMIN', 'OWNER'], config.requireActive);

      case 'CUSTOM':
        if (!config.allowedRoles || config.allowedRoles.length === 0) {
          throw new BadRequestException('Configuración CUSTOM requiere allowedRoles');
        }
        return await this.validateRoles(organizationId, userId, config.allowedRoles, config.requireActive);

      default:
        throw new BadRequestException(`Tipo de validación no soportado: ${config.type}`);
    }
  }

  /**
   * Valida si el usuario tiene uno de los roles especificados
   */
  private async validateRoles(
    organizationId: string, 
    userId: string, 
    allowedRoles: string[], 
    requireActive: boolean = true
  ): Promise<boolean> {
    // Verificar si es propietario (activo o no según configuración)
    const isOwner = requireActive 
      ? await this.organizationOwnersService.isActiveOwner(organizationId, userId)
      : await this.organizationOwnersService.isOwner(organizationId, userId);

    if (!isOwner) {
      return false;
    }

    // Obtener owners para encontrar el rol del usuario
    const owners = requireActive 
      ? await this.organizationOwnersService.getActiveOwners(organizationId)
      : await this.organizationOwnersService.getOwners(organizationId);

    const userOwnership = owners.find(owner => owner.userId === userId);
    
    if (!userOwnership) {
      return false;
    }

    // Verificar si el rol está en la lista de roles permitidos
    return allowedRoles.includes(userOwnership.role);
  }

  /**
   * Obtiene el mensaje de error por defecto según el tipo de validación
   */
  private getDefaultErrorMessage(type: OwnershipValidationType): string {
    switch (type) {
      case 'OWNER':
        return 'Debes ser propietario de esta organización';
      case 'ACTIVE_OWNER':
        return 'Debes ser un propietario activo de esta organización';
      case 'ADMIN_OR_OWNER':
        return 'Debes tener rol de ADMIN o OWNER en esta organización';
      case 'OWNER_ONLY':
        return 'Solo los propietarios principales (OWNER) pueden realizar esta acción';
      case 'MEMBER_OR_ABOVE':
        return 'Debes ser miembro de esta organización';
      case 'CUSTOM':
        return 'No tienes los permisos necesarios en esta organización';
      default:
        return 'Acceso denegado';
    }
  }
} 