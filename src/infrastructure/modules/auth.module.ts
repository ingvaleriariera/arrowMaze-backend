import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../orm/user.entity';
import { AuthController } from '../../adapters/controllers/auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { UserRepositoryImpl } from '../../adapters/repositories/user.repository.impl';
import { UserEntityMapper } from '../../adapters/mappers/user-entity.mapper';
import { UserMapper } from '../../adapters/mappers/user.mapper';
import { BcryptPasswordEncoder } from '../services/bcrypt-password-encoder';
import { JwtTokenProviderImpl } from '../services/jwt-token-provider.impl';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PASSWORD_ENCODER } from '../../application/ports/password-encoder.port';
import { JWT_TOKEN_PROVIDER } from '../../application/ports/jwt-token-provider.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    UserEntityMapper,
    UserMapper,
    {
      provide: PASSWORD_ENCODER,
      useClass: BcryptPasswordEncoder,
    },
    {
      provide: JWT_TOKEN_PROVIDER,
      useClass: JwtTokenProviderImpl,
    },
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, JWT_TOKEN_PROVIDER, USER_REPOSITORY],
})
export class AuthModule {}
