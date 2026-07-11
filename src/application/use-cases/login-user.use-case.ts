import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import type { IPasswordEncoder } from '../ports/password-encoder.port';
import type { IJwtTokenProvider } from '../ports/jwt-token-provider.port';
import { PASSWORD_ENCODER } from '../ports/password-encoder.port';
import { JWT_TOKEN_PROVIDER } from '../ports/jwt-token-provider.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { User } from '../../domain/aggregates/user.aggregate';
import { LoginUserInput } from '../dtos/login-user.input';
import { LoginUserOutput } from '../dtos/login-user.output';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_ENCODER)
    private readonly passwordEncoder: IPasswordEncoder,
    @Inject(JWT_TOKEN_PROVIDER)
    private readonly jwtTokenProvider: IJwtTokenProvider,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.resolveUser(input.emailOrUsername);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await this.passwordEncoder.verify(
      input.password,
      user.getPasswordHash().toString(),
    );

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.jwtTokenProvider.generateToken(
      user.getId().toString(),
      user.getRole().getValue(),
    );

    const output = new LoginUserOutput();
    output.userId = user.getId().toString();
    output.username = user.getUsername().toString();
    output.token = token;

    return output;
  }

  // An identifier with '@' can only be an email (usernames allow only
  // letters, numbers and underscores — see the Username value object),
  // so there's no ambiguity to resolve, just one lookup or the other.
  // A malformed identifier (fails both VOs) is treated as credentials
  // that don't match rather than a distinct error, to avoid leaking
  // which accounts exist.
  private async resolveUser(emailOrUsername: string): Promise<User | null> {
    try {
      if (emailOrUsername.includes('@')) {
        return await this.userRepository.findByEmail(
          Email.create(emailOrUsername),
        );
      }
      return await this.userRepository.findByUsername(
        Username.create(emailOrUsername),
      );
    } catch {
      return null;
    }
  }
}
