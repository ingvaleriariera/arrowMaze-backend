import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // AOP Aspect: Authorization by role
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }

    return true;
  }
}
