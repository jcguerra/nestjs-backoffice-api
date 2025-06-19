import { ApiProperty } from '@nestjs/swagger';

// Schemas para respuestas de organizaciones
export class OrganizationResponseSchema {
  @ApiProperty({
    description: 'ID único de la organización',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la organización',
    example: 'Acme Corporation',
    minLength: 2,
    maxLength: 100
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la organización',
    example: 'Una empresa dedicada a soluciones tecnológicas innovadoras',
    required: false,
    nullable: true
  })
  description: string | null;

  @ApiProperty({
    description: 'Estado activo de la organización',
    example: true,
    default: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha y hora de creación',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Fecha y hora de última actualización',
    example: '2024-01-15T15:45:30.000Z',
    format: 'date-time'
  })
  updatedAt: string;
}

// Schema para propietarios
export class OwnerInfoSchema {
  @ApiProperty({
    description: 'ID del usuario propietario',
    example: '987e6543-e21c-98d7-b654-321987654321',
    format: 'uuid'
  })
  userId: string;

  @ApiProperty({
    description: 'Email del propietario',
    example: 'propietario@ejemplo.com',
    format: 'email'
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del propietario',
    example: 'Juan'
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del propietario',
    example: 'Pérez'
  })
  lastName: string;

  @ApiProperty({
    description: 'Rol del propietario en la organización',
    example: 'OWNER',
    enum: ['OWNER', 'ADMIN', 'MEMBER']
  })
  role: string;

  @ApiProperty({
    description: 'Fecha de asignación como propietario',
    example: '2024-01-10T09:00:00.000Z',
    format: 'date-time'
  })
  assignedAt: string;

  @ApiProperty({
    description: 'ID del usuario que asignó este rol',
    example: '456e7890-a12b-34c5-d678-901234567890',
    format: 'uuid'
  })
  assignedBy: string;

  @ApiProperty({
    description: 'Estado activo del propietario',
    example: true,
    default: true
  })
  isActive: boolean;
}

// Schema para organización con propietarios
export class OrganizationWithOwnersResponseSchema extends OrganizationResponseSchema {
  @ApiProperty({
    description: 'Lista de propietarios de la organización',
    type: [OwnerInfoSchema]
  })
  owners: OwnerInfoSchema[];
}

// Schema para paginación
export class PaginationMetaSchema {
  @ApiProperty({
    description: 'Número total de elementos',
    example: 50,
    minimum: 0
  })
  total: number;

  @ApiProperty({
    description: 'Número de página actual',
    example: 1,
    minimum: 1
  })
  page: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  limit: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 5,
    minimum: 1
  })
  totalPages: number;
}

// Schema para respuesta paginada de organizaciones
export class PaginatedOrganizationsResponseSchema {
  @ApiProperty({
    description: 'Lista de organizaciones',
    type: [OrganizationResponseSchema]
  })
  data: OrganizationResponseSchema[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    type: PaginationMetaSchema
  })
  meta: PaginationMetaSchema;
}

// Schema para respuesta paginada de organizaciones con propietarios
export class PaginatedOrganizationsWithOwnersResponseSchema {
  @ApiProperty({
    description: 'Lista de organizaciones con propietarios',
    type: [OrganizationWithOwnersResponseSchema]
  })
  data: OrganizationWithOwnersResponseSchema[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    type: PaginationMetaSchema
  })
  meta: PaginationMetaSchema;
}

// Schema para respuesta de eliminación
export class DeleteResponseSchema {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Organización eliminada exitosamente'
  })
  message: string;

  @ApiProperty({
    description: 'ID de la organización eliminada',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  deletedId: string;

  @ApiProperty({
    description: 'Fecha y hora de eliminación',
    example: '2024-01-15T16:20:00.000Z',
    format: 'date-time'
  })
  deletedAt: string;
}

// Schemas para errores
export class BadRequestErrorSchema {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    description: 'Descripción del error',
    example: 'Bad Request'
  })
  error: string;

  @ApiProperty({
    description: 'Mensaje(s) de error detallado',
    example: ['El nombre es requerido', 'El email debe ser válido'],
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } }
    ]
  })
  message: string | string[];
}

export class NotFoundErrorSchema {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 404
  })
  statusCode: number;

  @ApiProperty({
    description: 'Descripción del error',
    example: 'Not Found'
  })
  error: string;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Organización no encontrada'
  })
  message: string;
}

export class UnauthorizedErrorSchema {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 401
  })
  statusCode: number;

  @ApiProperty({
    description: 'Descripción del error',
    example: 'Unauthorized'
  })
  error: string;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Token de autenticación requerido'
  })
  message: string;
}

export class ForbiddenErrorSchema {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 403
  })
  statusCode: number;

  @ApiProperty({
    description: 'Descripción del error',
    example: 'Forbidden'
  })
  error: string;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'No tienes permisos para realizar esta acción'
  })
  message: string;
} 