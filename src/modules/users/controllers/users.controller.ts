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
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IUsersService } from '../interfaces/users-service.interface';
import { 
  IUserResponse, 
  IPaginatedUsersResponse, 
  IDeleteResponse,
  IUserQueryOperations,
  IUserMutationOperations,
  IUserPaginationOperations 
} from '../interfaces/user-response.interface';
import { UserMapper } from '../mappers/user.mapper';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController implements IUserQueryOperations, IUserMutationOperations, IUserPaginationOperations {
  constructor(
    @Inject('IUsersService')
    private readonly usersService: IUsersService
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear usuario',
    description: 'Crea un nuevo usuario en el sistema'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        firstName: { type: 'string', example: 'Juan' },
        lastName: { type: 'string', example: 'Pérez' },
        role: { type: 'string', example: 'USER' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos o email ya existe' })
  async create(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user = await this.usersService.create(createUserDto);
    return UserMapper.toResponse(user);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener usuarios',
    description: 'Obtiene una lista de usuarios con paginación opcional'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              email: { type: 'string', example: 'usuario@ejemplo.com' },
              firstName: { type: 'string', example: 'Juan' },
              lastName: { type: 'string', example: 'Pérez' },
              role: { type: 'string', example: 'USER' },
              isActive: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 }
      }
    }
  })
  async findAllWithPagination(@Query() paginationDto: PaginationDto): Promise<IPaginatedUsersResponse | IUserResponse[]> {
    if (paginationDto.page && paginationDto.limit) {
      return this.findAllPaginated(paginationDto.page, paginationDto.limit);
    }
    return this.findAll();
  }

  async findAll(): Promise<IUserResponse[]> {
    const users = await this.usersService.findAll();
    return UserMapper.toResponseArray(users);
  }

  async findAllPaginated(page: number, limit: number): Promise<IPaginatedUsersResponse> {
    const paginatedUsers = await this.usersService.findAllPaginated(page, limit);
    return UserMapper.toPaginatedResponse(paginatedUsers);
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Obtener usuarios activos',
    description: 'Obtiene una lista de todos los usuarios activos'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios activos obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          firstName: { type: 'string', example: 'Juan' },
          lastName: { type: 'string', example: 'Pérez' },
          role: { type: 'string', example: 'USER' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  async findActiveUsers(): Promise<IUserResponse[]> {
    const users = await this.usersService.findActiveUsers();
    return UserMapper.toResponseArray(users);
  }

  @Get('role/:role')
  @ApiOperation({ 
    summary: 'Obtener usuarios por rol',
    description: 'Obtiene una lista de usuarios filtrados por rol específico'
  })
  @ApiParam({ name: 'role', description: 'Rol del usuario', example: 'USER' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios por rol obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          firstName: { type: 'string', example: 'Juan' },
          lastName: { type: 'string', example: 'Pérez' },
          role: { type: 'string', example: 'USER' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Rol inválido' })
  async findByRole(@Param('role') role: string): Promise<IUserResponse[]> {
    const users = await this.usersService.findByRole(role);
    return UserMapper.toResponseArray(users);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener usuario por ID',
    description: 'Obtiene un usuario específico por su ID'
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        firstName: { type: 'string', example: 'Juan' },
        lastName: { type: 'string', example: 'Pérez' },
        role: { type: 'string', example: 'USER' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string): Promise<IUserResponse> {
    const user = await this.usersService.findOne(id);
    return UserMapper.toResponse(user);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar usuario',
    description: 'Actualiza parcialmente un usuario existente'
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        firstName: { type: 'string', example: 'Juan' },
        lastName: { type: 'string', example: 'Pérez' },
        role: { type: 'string', example: 'USER' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<IUserResponse> {
    const user = await this.usersService.update(id, updateUserDto);
    return UserMapper.toResponse(user);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema'
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario eliminado exitosamente' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string): Promise<IDeleteResponse> {
    await this.usersService.remove(id);
    return UserMapper.toDeleteResponse();
  }
} 