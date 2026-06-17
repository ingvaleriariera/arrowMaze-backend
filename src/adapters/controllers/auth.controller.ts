import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterRequestDto } from '../dtos/register.request.dto';
import { RegisterResponseDto } from '../dtos/register.response.dto';
import { LoginRequestDto } from '../dtos/login.request.dto';
import { LoginResponseDto } from '../dtos/login.response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly userMapper: UserMapper,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
  })
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    try {
      const input = this.userMapper.toRegisterInput(registerDto);
      const output = await this.registerUserUseCase.execute(input);
      return this.userMapper.toRegisterResponse(output);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Email already registered') {
          throw new ConflictException('Email already registered');
        }
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() loginDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    try {
      const input = this.userMapper.toLoginInput(loginDto);
      const output = await this.loginUserUseCase.execute(input);
      return this.userMapper.toLoginResponse(output);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid credentials') {
          throw new UnauthorizedException('Invalid credentials');
        }
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
