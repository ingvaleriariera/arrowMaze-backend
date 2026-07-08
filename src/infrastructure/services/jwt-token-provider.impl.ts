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
    return jwt.sign(payload, this.secret, {
      expiresIn: this.parseExpiresInSeconds(this.expiresIn),
    });
  }

  // JWT_EXPIRES_IN may be a plain number of seconds ("86400") or a
  // duration string like "1d"/"12h"/"30m". A bare parseInt() on a
  // duration string silently truncates "1d" down to 1 (second), which is
  // what produced tokens expiring almost immediately — so unit suffixes
  // are parsed explicitly here instead.
  private parseExpiresInSeconds(value: string): number {
    const match = value.trim().match(/^(\d+)\s*([smhd])?$/i);
    if (!match) return 86400;
    const amount = parseInt(match[1], 10);
    const unitSeconds: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    return amount * unitSeconds[(match[2] || 's').toLowerCase()];
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
