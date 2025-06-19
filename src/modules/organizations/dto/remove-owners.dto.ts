import { 
  IsNotEmpty, 
  IsArray, 
  IsUUID, 
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveOwnersDto {
  @ApiProperty({
    description: 'Lista de IDs de usuarios propietarios que serán removidos de la organización. Los usuarios deben ser propietarios actuales de la organización. No se puede remover el último propietario OWNER.',
    example: ['987e6543-e21c-98d7-b654-321987654321', '456e7890-a12b-34c5-d678-901234567890'],
    type: [String],
    minItems: 1,
    maxItems: 10,
    format: 'uuid'
  })
  @IsArray({ message: 'Los usuarios deben ser un array' })
  @IsNotEmpty({ message: 'Debe especificar al menos un usuario' })
  @ArrayMinSize(1, { message: 'Debe remover al menos un propietario' })
  @ArrayMaxSize(10, { message: 'No se pueden remover más de 10 propietarios a la vez' })
  @IsUUID('4', { 
    each: true, 
    message: 'Cada ID de usuario debe ser un UUID válido' 
  })
  userIds: string[];
} 