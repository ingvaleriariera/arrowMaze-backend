export const JWT_TOKEN_PROVIDER = 'JWT_TOKEN_PROVIDER';

export interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export interface IJwtTokenProvider {
  generateToken(userId: string, role: string): string;
  verifyToken(token: string): JwtPayload;
}
