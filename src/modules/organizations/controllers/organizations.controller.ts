import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IOrganizationsService } from '../interfaces/organizations-service.interface';
import { 
  IOrganizationResponse, 
  IOrganizationWithOwnersResponse,
  IPaginatedOrganizationsResponse,
  IPaginatedOrganizationsWithOwnersResponse,
  IDeleteResponse,
  IOrganizationQueryOperations,
  IOrganizationMutationOperations,
  IOrganizationPaginationOperations 
} from '../interfaces/organization-response.interface';
import { OrganizationMapper } from '../mappers/organization.mapper';

@ApiTags('organizations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController implements IOrganizationQueryOperations, IOrganizationMutationOperations, IOrganizationPaginationOperations {
  constructor(
    @Inject('IOrganizationsService')
    private readonly organizationsService: IOrganizationsService
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear organización',
    description: 'Crea una nueva organización en el sistema con los propietarios iniciales especificados'
  })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Organización creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Mi Organización' },
        description: { type: 'string', example: 'Descripción de la organización' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos, nombre ya existe, o usuarios propietarios no válidos' })
  async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<IOrganizationResponse> {
    const organization = await this.organizationsService.create(createOrganizationDto);
    return OrganizationMapper.toResponse(organization);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener organizaciones',
    description: 'Obtiene una lista de organizaciones con paginación opcional'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página', example: 10 })
  @ApiQuery({ name: 'includeOwners', required: false, type: Boolean, description: 'Incluir información de propietarios', example: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de organizaciones obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              name: { type: 'string', example: 'Mi Organización' },
              description: { type: 'string', example: 'Descripción de la organización' },
              isActive: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        total: { type: 'number', example: 50 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 5 }
      }
    }
  })
  async findAllWithPagination(
    @Query() paginationDto: PaginationDto,
    @Query('includeOwners') includeOwners?: boolean
  ): Promise<IPaginatedOrganizationsResponse | IPaginatedOrganizationsWithOwnersResponse | IOrganizationResponse[] | IOrganizationWithOwnersResponse[]> {
    if (paginationDto.page && paginationDto.limit) {
      if (includeOwners) {
        return this.findAllWithOwnersPaginated(paginationDto.page, paginationDto.limit);
      }
      return this.findAllPaginated(paginationDto.page, paginationDto.limit);
    }
    
    if (includeOwners) {
      return this.findAllWithOwners();
    }
    return this.findAll();
  }

  async findAll(): Promise<IOrganizationResponse[]> {
    const organizations = await this.organizationsService.findAll();
    return OrganizationMapper.toResponseArray(organizations);
  }

  async findAllPaginated(page: number, limit: number): Promise<IPaginatedOrganizationsResponse> {
    const paginatedOrganizations = await this.organizationsService.findAllPaginated(page, limit);
    return OrganizationMapper.toPaginatedResponse(paginatedOrganizations);
  }

  async findAllWithOwnersPaginated(page: number, limit: number): Promise<IPaginatedOrganizationsWithOwnersResponse> {
    // Por ahora usamos el método básico - en futura fase se implementará específicamente
    const paginatedOrganizations = await this.organizationsService.findAllPaginated(page, limit);
    return OrganizationMapper.toPaginatedResponseWithOwners(paginatedOrganizations);
  }

  async findAllWithOwners(): Promise<IOrganizationWithOwnersResponse[]> {
    // Por ahora usamos el método básico - en futura fase se implementará específicamente
    const organizations = await this.organizationsService.findAll();
    return OrganizationMapper.toResponseWithOwnersArray(organizations);
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Obtener organizaciones activas',
    description: 'Obtiene una lista de todas las organizaciones activas'
  })
  @ApiQuery({ name: 'includeOwners', required: false, type: Boolean, description: 'Incluir información de propietarios', example: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de organizaciones activas obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          name: { type: 'string', example: 'Mi Organización' },
          description: { type: 'string', example: 'Descripción de la organización' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  async findActiveOrganizations(@Query('includeOwners') includeOwners?: boolean): Promise<IOrganizationResponse[] | IOrganizationWithOwnersResponse[]> {
    const organizations = await this.organizationsService.findActiveOrganizations();
    
    if (includeOwners) {
      return OrganizationMapper.toResponseWithOwnersArray(organizations);
    }
    return OrganizationMapper.toResponseArray(organizations);
  }

  @Get('by-owner/:ownerId')
  @ApiOperation({ 
    summary: 'Obtener organizaciones por propietario',
    description: 'Obtiene una lista de organizaciones donde el usuario especificado es propietario'
  })
  @ApiParam({ name: 'ownerId', description: 'ID del usuario propietario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiQuery({ name: 'includeOwners', required: false, type: Boolean, description: 'Incluir información de propietarios', example: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de organizaciones por propietario obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          name: { type: 'string', example: 'Mi Organización' },
          description: { type: 'string', example: 'Descripción de la organización' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'ID de propietario inválido' })
  @ApiNotFoundResponse({ description: 'Propietario no encontrado' })
  async findByOwner(
    @Param('ownerId') ownerId: string,
    @Query('includeOwners') includeOwners?: boolean
  ): Promise<IOrganizationResponse[] | IOrganizationWithOwnersResponse[]> {
    const organizations = await this.organizationsService.findByOwner(ownerId);
    
    if (includeOwners) {
      return OrganizationMapper.toResponseWithOwnersArray(organizations);
    }
    return OrganizationMapper.toResponseArray(organizations);
  }

  @Get('name/:name')
  @ApiOperation({ 
    summary: 'Obtener organización por nombre',
    description: 'Obtiene una organización específica por su nombre exacto'
  })
  @ApiParam({ name: 'name', description: 'Nombre de la organización', example: 'Mi Organización' })
  @ApiQuery({ name: 'includeOwners', required: false, type: Boolean, description: 'Incluir información de propietarios', example: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Organización encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Mi Organización' },
        description: { type: 'string', example: 'Descripción de la organización' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Nombre inválido' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async findByName(
    @Param('name') name: string,
    @Query('includeOwners') includeOwners?: boolean
  ): Promise<IOrganizationResponse | IOrganizationWithOwnersResponse> {
    const organization = await this.organizationsService.findByName(name);
    
    if (!organization) {
      throw new Error('Organización no encontrada');
    }
    
    if (includeOwners) {
      return OrganizationMapper.toResponseWithOwners(organization);
    }
    return OrganizationMapper.toResponse(organization);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener organización por ID',
    description: 'Obtiene una organización específica por su ID'
  })
  @ApiParam({ name: 'id', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiQuery({ name: 'includeOwners', required: false, type: Boolean, description: 'Incluir información de propietarios', example: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Organización encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Mi Organización' },
        description: { type: 'string', example: 'Descripción de la organización' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        owners: {
          type: 'array',
          description: 'Solo incluido si includeOwners=true',
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
      }
    }
  })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async findOne(
    @Param('id') id: string,
    @Query('includeOwners') includeOwners?: boolean
  ): Promise<IOrganizationResponse | IOrganizationWithOwnersResponse> {
    const organization = await this.organizationsService.findOne(id);
    
    if (includeOwners) {
      return OrganizationMapper.toResponseWithOwners(organization);
    }
    
    return OrganizationMapper.toResponse(organization);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar organización',
    description: 'Actualiza los datos de una organización existente'
  })
  @ApiParam({ name: 'id', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Organización actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Mi Organización Actualizada' },
        description: { type: 'string', example: 'Nueva descripción' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos o nombre ya existe' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async update(
    @Param('id') id: string, 
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<IOrganizationResponse> {
    const organization = await this.organizationsService.update(id, updateOrganizationDto);
    return OrganizationMapper.toResponse(organization);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar organización',
    description: 'Elimina una organización y todas sus relaciones asociadas'
  })
  @ApiParam({ name: 'id', description: 'ID de la organización', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Organización eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Organización eliminada exitosamente' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  @ApiNotFoundResponse({ description: 'Organización no encontrada' })
  async remove(@Param('id') id: string): Promise<IDeleteResponse> {
    await this.organizationsService.remove(id);
    return OrganizationMapper.toDeleteResponse();
  }
} 