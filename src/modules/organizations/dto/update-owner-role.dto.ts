import { 
  IsNotEmpty, 
  IsUUID, 
  IsString,
  MaxLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOwnerRoleDto {
  @ApiProperty({
    description: 'ID del usuario propietario al que cambiar el rol',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  userId: string;

  @ApiProperty({
    description: 'Nuevo rol a asignar al propietario',
    example: 'ADMIN',
    maxLength: 50
  })
  @IsString({ message: 'El rol debe ser un string' })
  @IsNotEmpty({ message: 'El nuevo rol es requerido' })
  @MaxLength(50, { message: 'El rol no puede exceder 50 caracteres' })
  newRole: string;
} 