import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  IJwtTokenProvider,
  JwtPayload,
} from '../../application/ports/jwt-token-provider.port';

@Injectable()
export class JwtTokenProviderImpl implements IJwtTokenProvider {
  private readonly secret = process.env.JWT_SECRET || 'your-secret-key';
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || '86400';

  generateToken(userId: string, role: string): string {
    const payload = { userId, role };
    const expiresInSeconds = parseInt(this.expiresIn, 10);
    return jwt.sign(payload, this.secret, { expiresIn: expiresInSeconds });
  }

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
