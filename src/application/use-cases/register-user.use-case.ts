import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import type { IPasswordEncoder } from '../ports/password-encoder.port';
import type { IJwtTokenProvider } from '../ports/jwt-token-provider.port';
import { PASSWORD_ENCODER } from '../ports/password-encoder.port';
import { JWT_TOKEN_PROVIDER } from '../ports/jwt-token-provider.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { PasswordHash } from '../../domain/value-objects/password-hash.vo';
import { User } from '../../domain/aggregates/user.aggregate';
import { RegisterUserInput } from '../dtos/register-user.input';
import { RegisterUserOutput } from '../dtos/register-user.output';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_ENCODER)
    private readonly passwordEncoder: IPasswordEncoder,
    @Inject(JWT_TOKEN_PROVIDER)
    private readonly jwtTokenProvider: IJwtTokenProvider,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const email = Email.create(input.email);

    const existingUser = await this.userRepository.existsByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const username = Username.create(input.username);

    const existingUsername =
      await this.userRepository.existsByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    const hashedPassword = await this.passwordEncoder.hash(input.password);
    const passwordHash = PasswordHash.create(hashedPassword);

    const user = User.register(email, username, passwordHash);
    await this.userRepository.save(user);

    const token = this.jwtTokenProvider.generateToken(
      user.getId().toString(),
      user.getRole().getValue(),
    );

    const output = new RegisterUserOutput();
    output.userId = user.getId().toString();
    output.username = user.getUsername().toString();
    output.token = token;

    return output;
  }
}
