import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import type { IPasswordEncoder } from '../ports/password-encoder.port';
import type { IJwtTokenProvider } from '../ports/jwt-token-provider.port';
import { PASSWORD_ENCODER } from '../ports/password-encoder.port';
import { JWT_TOKEN_PROVIDER } from '../ports/jwt-token-provider.port';
import { Email } from '../../domain/value-objects/email.vo';
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
    const email = Email.create(input.email);
    const user = await this.userRepository.findByEmail(email);

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
}
