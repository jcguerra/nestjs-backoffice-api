import { 
  IsNotEmpty, 
  IsArray, 
  IsUUID, 
  ArrayMinSize,
  IsOptional,
  IsString,
  IsIn,
  ArrayMaxSize
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddOwnersDto {
  @ApiProperty({
    description: 'Lista de IDs de usuarios que serán agregados como propietarios de la organización. Todos los usuarios deben existir en el sistema y no pueden ser propietarios actuales de la organización.',
    example: ['987e6543-e21c-98d7-b654-321987654321', '456e7890-a12b-34c5-d678-901234567890'],
    type: [String],
    minItems: 1,
    maxItems: 10,
    format: 'uuid'
  })
  @IsArray({ message: 'Los usuarios deben ser un array' })
  @IsNotEmpty({ message: 'Debe especificar al menos un usuario' })
  @ArrayMinSize(1, { message: 'Debe agregar al menos un propietario' })
  @ArrayMaxSize(10, { message: 'No se pueden agregar más de 10 propietarios a la vez' })
  @IsUUID('4', { 
    each: true, 
    message: 'Cada ID de usuario debe ser un UUID válido' 
  })
  userIds: string[];

  @ApiPropertyOptional({
    description: 'Rol que se asignará a los nuevos propietarios. OWNER: acceso completo, ADMIN: gestión sin eliminación, MEMBER: acceso de lectura y operaciones básicas',
    example: 'MEMBER',
    default: 'MEMBER',
    enum: ['OWNER', 'ADMIN', 'MEMBER']
  })
  @IsOptional()
  @IsString({ message: 'El rol debe ser un string' })
  @IsIn(['OWNER', 'ADMIN', 'MEMBER'], { 
    message: 'El rol debe ser uno de: OWNER, ADMIN, MEMBER' 
  })
  role?: string = 'MEMBER';
} 