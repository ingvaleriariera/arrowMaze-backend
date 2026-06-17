import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import type { IJwtTokenProvider } from '../../application/ports/jwt-token-provider.port';
import { JWT_TOKEN_PROVIDER } from '../../application/ports/jwt-token-provider.port';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_TOKEN_PROVIDER)
    private readonly jwtTokenProvider: IJwtTokenProvider,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.substring(7);

    try {
      const payload = this.jwtTokenProvider.verifyToken(token);
      (request as any).user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
