import { Injectable, NestMiddleware, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IOrganizationsService } from '../interfaces/organizations-service.interface';
import { IOrganizationOwnersService } from '../interfaces/organization-owners-service.interface';
import { Organization } from '../entities/organization.entity';
import { OrganizationOwner } from '../entities/organization-owner.entity';
import { User } from '../../users/entities/user.entity';

// Extender el tipo Request para incluir contexto de organización
declare global {
  namespace Express {
    interface Request {
      organizationContext?: {
        organization: Organization;
        userOwnership?: OrganizationOwner;
        isOwner: boolean;
        userRole?: string;
      };
    }
  }
}

/**
 * Middleware que establece el contexto de organización en la request
 * 
 * Funcionalidades:
 * - Extrae organizationId de los parámetros de ruta
 * - Verifica que la organización existe y está activa
 * - Si hay usuario autenticado, verifica su relación con la organización
 * - Agrega información de contexto a req.organizationContext
 * 
 * Uso:
 * - Aplicar en rutas que requieren contexto de organización
 * - Usar después de middleware de autenticación si se requiere info de usuario
 */
@Injectable()
export class OrganizationContextMiddleware implements NestMiddleware {
  constructor(
    @Inject('IOrganizationsService')
    private readonly organizationsService: IOrganizationsService,
    @Inject('IOrganizationOwnersService')
    private readonly organizationOwnersService: IOrganizationOwnersService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const organizationId = req.params.organizationId;

    // Si no hay organizationId en la ruta, continuar sin establecer contexto
    if (!organizationId) {
      return next();
    }

    try {
      // Verificar que es un UUID válido (básico)
      if (!this.isValidUUID(organizationId)) {
        throw new BadRequestException('ID de organización inválido');
      }

      // Obtener la organización
      const organization = await this.organizationsService.findOne(organizationId);
      
      if (!organization) {
        throw new NotFoundException('Organización no encontrada');
      }

      // Verificar que la organización está activa
      if (!organization.isActive) {
        throw new BadRequestException('La organización no está activa');
      }

      // Inicializar contexto básico
      const organizationContext: any = {
        organization,
        isOwner: false,
      };

      // Si hay usuario autenticado, obtener su relación con la organización
      const user: User = req.user as User;
      if (user) {
        try {
          // Verificar si es propietario
          const isOwner = await this.organizationOwnersService.isOwner(organizationId, user.id);
          const isActiveOwner = await this.organizationOwnersService.isActiveOwner(organizationId, user.id);

          organizationContext.isOwner = isOwner;

          // Si es propietario activo, obtener detalles del ownership
          if (isActiveOwner) {
            const owners = await this.organizationOwnersService.getActiveOwners(organizationId);
            const userOwnership = owners.find(owner => owner.userId === user.id);
            
            if (userOwnership) {
              organizationContext.userOwnership = userOwnership;
              organizationContext.userRole = userOwnership.role;
            }
          }
        } catch (error) {
          // En caso de error al obtener ownership, continuar sin esa información
          console.warn(`Error al obtener ownership para usuario ${user.id} en organización ${organizationId}:`, error.message);
        }
      }

      // Agregar contexto a la request
      req.organizationContext = organizationContext;

      next();
    } catch (error) {
      // Pasar errores HTTP al manejador de errores de NestJS
      next(error);
    }
  }

  /**
   * Validación básica de UUID
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

/**
 * Función helper para obtener el contexto de organización desde la request
 */
export function getOrganizationContext(req: Request) {
  return req.organizationContext;
}

/**
 * Función helper para verificar si el usuario actual es propietario de la organización
 */
export function isCurrentUserOwner(req: Request): boolean {
  return req.organizationContext?.isOwner || false;
}

/**
 * Función helper para obtener el rol del usuario actual en la organización
 */
export function getCurrentUserRole(req: Request): string | undefined {
  return req.organizationContext?.userRole;
}

/**
 * Función helper para verificar si el usuario actual tiene un rol específico
 */
export function hasRole(req: Request, role: string): boolean {
  return req.organizationContext?.userRole === role;
}

/**
 * Función helper para verificar si el usuario actual tiene uno de varios roles
 */
export function hasAnyRole(req: Request, roles: string[]): boolean {
  const userRole = req.organizationContext?.userRole;
  return userRole ? roles.includes(userRole) : false;
} 