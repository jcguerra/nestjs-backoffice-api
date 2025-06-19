import { 
  IsNotEmpty, 
  IsUUID, 
  IsString,
  IsIn
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOwnerRoleDto {
  @ApiProperty({
    description: 'ID del usuario propietario al que se le cambiará el rol. El usuario debe ser un propietario actual de la organización.',
    example: '987e6543-e21c-98d7-b654-321987654321',
    format: 'uuid'
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  userId: string;

  @ApiProperty({
    description: 'Nuevo rol a asignar al propietario. OWNER: acceso completo y capacidad de eliminar la organización, ADMIN: gestión completa sin eliminación, MEMBER: acceso de lectura y operaciones básicas',
    example: 'ADMIN',
    enum: ['OWNER', 'ADMIN', 'MEMBER']
  })
  @IsString({ message: 'El rol debe ser un string' })
  @IsNotEmpty({ message: 'El nuevo rol es requerido' })
  @IsIn(['OWNER', 'ADMIN', 'MEMBER'], { 
    message: 'El rol debe ser uno de: OWNER, ADMIN, MEMBER' 
  })
  newRole: string;
} 