import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddOwnersDto } from '../dto/add-owners.dto';
import { RemoveOwnersDto } from '../dto/remove-owners.dto';
import { UpdateOwnerRoleDto } from '../dto/update-owner-role.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IOrganizationOwnersService } from '../interfaces/organization-owners-service.interface';
import { 
  IOrganizationWithOwnersResponse,
  IOwnerInfo
} from '../interfaces/organization-response.interface';
import { OrganizationMapper } from '../mappers/organization.mapper';

@ApiTags('organization-owners')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('organizations/:organizationId/owners')
export class OrganizationOwnersController {
  constructor(
    @Inject('IOrganizationOwnersService')
    private readonly organizationOwnersService: IOrganizationOwnersService
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener propietarios de organización',
    description: 'Obtiene la lista completa de propietarios de una organización específica'
  })
  @ApiParam({ name: 'organizationId', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Solo propietarios activos', example: true })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de propietarios obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          email: { type: 'string', example: 'propietario@ejemplo.com' },
          firstName: { type: 'string', example: 'Juan' },
          lastName: { type: 'string', example: 'Pérez' },
          role: { type: 'string', example: 'OWNER' },
          assignedAt: { type: 'string', format: 'date-time' },
          assignedBy: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'ID de organización inválido' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async getOwners(
    @Param('organizationId') organizationId: string,
    @Query('activeOnly') activeOnly?: boolean
  ): Promise<IOwnerInfo[]> {
    let owners: any[];

    if (activeOnly) {
      owners = await this.organizationOwnersService.getActiveOwners(organizationId);
    } else {
      owners = await this.organizationOwnersService.getOwners(organizationId);
    }

    return OrganizationMapper.toOwnerInfoArray(owners);
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Obtener propietarios activos',
    description: 'Obtiene solo los propietarios activos de una organización'
  })
  @ApiParam({ name: 'organizationId', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de propietarios activos obtenida exitosamente'
  })
  @ApiBadRequestResponse({ description: 'ID de organización inválido' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async getActiveOwners(@Param('organizationId') organizationId: string): Promise<IOwnerInfo[]> {
    const owners = await this.organizationOwnersService.getActiveOwners(organizationId);
    return OrganizationMapper.toOwnerInfoArray(owners);
  }

  @Get('by-role/:role')
  @ApiOperation({ 
    summary: 'Obtener propietarios por rol',
    description: 'Obtiene propietarios de una organización filtrados por rol específico'
  })
  @ApiParam({ name: 'organizationId', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiParam({ name: 'role', description: 'Rol de los propietarios', example: 'OWNER' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de propietarios por rol obtenida exitosamente'
  })
  @ApiBadRequestResponse({ description: 'ID de organización o rol inválido' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async getOwnersByRole(
    @Param('organizationId') organizationId: string,
    @Param('role') role: string
  ): Promise<IOwnerInfo[]> {
    const owners = await this.organizationOwnersService.getOwnersByRole(organizationId, role);
    return OrganizationMapper.toOwnerInfoArray(owners);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Agregar propietarios',
    description: 'Agrega nuevos propietarios a una organización con el rol especificado'
  })
  @ApiParam({ name: 'organizationId', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: AddOwnersDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Propietarios agregados exitosamente'
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos, usuarios no válidos, o usuarios ya son propietarios' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async addOwners(
    @Param('organizationId') organizationId: string,
    @Body() addOwnersDto: AddOwnersDto
  ): Promise<IOrganizationWithOwnersResponse> {
    const organization = await this.organizationOwnersService.addOwners(organizationId, addOwnersDto);
    return OrganizationMapper.toResponseWithOwners(organization);
  }

  @Delete()
  @ApiOperation({ 
    summary: 'Remover propietarios',
    description: 'Remueve propietarios específicos de una organización'
  })
  @ApiParam({ name: 'organizationId', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: RemoveOwnersDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Propietarios removidos exitosamente'
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos, usuarios no válidos, o no se puede remover el último propietario' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async removeOwners(
    @Param('organizationId') organizationId: string,
    @Body() removeOwnersDto: RemoveOwnersDto
  ): Promise<IOrganizationWithOwnersResponse> {
    const organization = await this.organizationOwnersService.removeOwners(organizationId, removeOwnersDto);
    return OrganizationMapper.toResponseWithOwners(organization);
  }

  @Patch('role')
  @ApiOperation({ 
    summary: 'Actualizar rol de propietario',
    description: 'Actualiza el rol de un propietario específico en una organización'
  })
  @ApiParam({ name: 'organizationId', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateOwnerRoleDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol de propietario actualizado exitosamente'
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos, usuario no es propietario, o rol inválido' })
  @ApiNotFoundResponse({ description: 'Organización o usuario no encontrado' })
  async updateOwnerRole(
    @Param('organizationId') organizationId: string,
    @Body() updateOwnerRoleDto: UpdateOwnerRoleDto
  ): Promise<IOrganizationWithOwnersResponse> {
    const organization = await this.organizationOwnersService.updateOwnerRole(organizationId, updateOwnerRoleDto);
    return OrganizationMapper.toResponseWithOwners(organization);
  }

  @Patch(':userId/deactivate')
  @ApiOperation({ 
    summary: 'Desactivar propietario',
    description: 'Desactiva un propietario en una organización (soft delete)'
  })
  @ApiParam({ name: 'organizationId', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiParam({ name: 'userId', description: 'ID del usuario propietario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Propietario desactivado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Propietario desactivado exitosamente' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Usuario no es propietario, ya está inactivo, o es el último propietario activo' })
  @ApiNotFoundResponse({ description: 'Organización o usuario no encontrado' })
  async deactivateOwner(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string
  ): Promise<{ message: string }> {
    await this.organizationOwnersService.deactivateOwner(organizationId, userId);
    return { message: 'Propietario desactivado exitosamente' };
  }

  @Patch(':userId/reactivate')
  @ApiOperation({ 
    summary: 'Reactivar propietario',
    description: 'Reactiva un propietario previamente desactivado en una organización'
  })
  @ApiParam({ name: 'organizationId', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiParam({ name: 'userId', description: 'ID del usuario propietario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Propietario reactivado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Propietario reactivado exitosamente' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Usuario no es propietario o ya está activo' })
  @ApiNotFoundResponse({ description: 'Organización o usuario no encontrado' })
  async reactivateOwner(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string
  ): Promise<{ message: string }> {
    await this.organizationOwnersService.reactivateOwner(organizationId, userId);
    return { message: 'Propietario reactivado exitosamente' };
  }
} 