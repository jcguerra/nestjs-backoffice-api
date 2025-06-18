import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}

export class EmailAlreadyExistsException extends BusinessException {
  constructor() {
    super('El email ya está en uso', HttpStatus.CONFLICT);
  }
}

export class UserNotFoundException extends BusinessException {
  constructor() {
    super('Usuario no encontrado', HttpStatus.NOT_FOUND);
  }
} 