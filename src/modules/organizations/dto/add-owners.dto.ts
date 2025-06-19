import { 
  IsNotEmpty, 
  IsArray, 
  IsUUID, 
  ArrayMinSize,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddOwnersDto {
  @ApiProperty({
    description: 'IDs de los usuarios a agregar como propietarios',
    example: ['123e4567-e89b-12d3-a456-426614174000', '987e6543-e21c-98d7-b654-321987654321'],
    type: [String],
    minItems: 1
  })
  @IsArray({ message: 'Los usuarios deben ser un array' })
  @IsNotEmpty({ message: 'Debe especificar al menos un usuario' })
  @ArrayMinSize(1, { message: 'Debe agregar al menos un propietario' })
  @IsUUID('4', { 
    each: true, 
    message: 'Cada ID de usuario debe ser un UUID válido' 
  })
  userIds: string[];

  @ApiPropertyOptional({
    description: 'Rol a asignar a los nuevos propietarios',
    example: 'OWNER',
    default: 'OWNER',
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'El rol debe ser un string' })
  @MaxLength(50, { message: 'El rol no puede exceder 50 caracteres' })
  role?: string = 'OWNER';
} 