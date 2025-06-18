import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Aquí implementarías tu lógica de autenticación
    // Por ejemplo, verificar JWT token
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    // Lógica de validación del token
    const authHeader = request.headers.authorization;
    return authHeader && authHeader.startsWith('Bearer ');
  }
} 