import { 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsArray, 
  IsUUID, 
  ArrayMinSize,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Nombre de la organización',
    example: 'Acme Corporation',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción de la organización',
    example: 'Una empresa dedicada a soluciones tecnológicas innovadoras',
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un string' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'IDs de los usuarios propietarios de la organización',
    example: ['123e4567-e89b-12d3-a456-426614174000', '987e6543-e21c-98d7-b654-321987654321'],
    type: [String],
    minItems: 1
  })
  @IsArray({ message: 'Los propietarios deben ser un array' })
  @IsNotEmpty({ message: 'Debe tener al menos un propietario' })
  @ArrayMinSize(1, { message: 'Debe tener al menos un propietario' })
  @IsUUID('4', { 
    each: true, 
    message: 'Cada propietario debe ser un UUID válido' 
  })
  ownerIds: string[];
} 