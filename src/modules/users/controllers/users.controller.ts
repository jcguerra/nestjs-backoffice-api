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
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
  findAll(@Query() paginationDto: PaginationDto) {
    if (paginationDto.page && paginationDto.limit) {
      return this.usersService.findAllPaginated(
        paginationDto.page,
        paginationDto.limit,
      );
    }
    return this.usersService.findAll();
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
  findActiveUsers() {
    return this.usersService.findActiveUsers();
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
  findByRole(@Param('role') role: string) {
    return this.usersService.findByRole(role);
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
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
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
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
} 