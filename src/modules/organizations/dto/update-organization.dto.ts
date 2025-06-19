import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  MaxLength, 
  MinLength 
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Nombre de la organización',
    example: 'Acme Corporation Updated',
    minLength: 2,
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un string' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción de la organización',
    example: 'Una empresa dedicada a soluciones tecnológicas innovadoras y sostenibles',
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un string' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Estado activo de la organización',
    example: true
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un booleano' })
  isActive?: boolean;
} 