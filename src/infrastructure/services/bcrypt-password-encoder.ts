import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordEncoder } from '../../application/ports/password-encoder.port';

@Injectable()
export class BcryptPasswordEncoder implements IPasswordEncoder {
  private readonly saltRounds = 10;

  async hash(raw: string): Promise<string> {
    return bcrypt.hash(raw, this.saltRounds);
  }

  async verify(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }
}
