import { 
  IsNotEmpty, 
  IsArray, 
  IsUUID, 
  ArrayMinSize
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveOwnersDto {
  @ApiProperty({
    description: 'IDs de los usuarios a remover como propietarios',
    example: ['123e4567-e89b-12d3-a456-426614174000', '987e6543-e21c-98d7-b654-321987654321'],
    type: [String],
    minItems: 1
  })
  @IsArray({ message: 'Los usuarios deben ser un array' })
  @IsNotEmpty({ message: 'Debe especificar al menos un usuario' })
  @ArrayMinSize(1, { message: 'Debe remover al menos un propietario' })
  @IsUUID('4', { 
    each: true, 
    message: 'Cada ID de usuario debe ser un UUID válido' 
  })
  userIds: string[];
} 