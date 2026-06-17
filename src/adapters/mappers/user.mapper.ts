import { Injectable } from '@nestjs/common';
import { RegisterRequestDto } from '../dtos/register.request.dto';
import { RegisterResponseDto } from '../dtos/register.response.dto';
import { LoginRequestDto } from '../dtos/login.request.dto';
import { LoginResponseDto } from '../dtos/login.response.dto';
import { RegisterUserInput } from '../../application/dtos/register-user.input';
import { RegisterUserOutput } from '../../application/dtos/register-user.output';
import { LoginUserInput } from '../../application/dtos/login-user.input';
import { LoginUserOutput } from '../../application/dtos/login-user.output';

@Injectable()
export class UserMapper {
  toRegisterInput(dto: RegisterRequestDto): RegisterUserInput {
    const input = new RegisterUserInput();
    input.email = dto.email;
    input.username = dto.username;
    input.password = dto.password;
    return input;
  }

  toLoginInput(dto: LoginRequestDto): LoginUserInput {
    const input = new LoginUserInput();
    input.email = dto.email;
    input.password = dto.password;
    return input;
  }

  toRegisterResponse(output: RegisterUserOutput): RegisterResponseDto {
    const response = new RegisterResponseDto();
    response.userId = output.userId;
    response.username = output.username;
    response.token = output.token;
    return response;
  }

  toLoginResponse(output: LoginUserOutput): LoginResponseDto {
    const response = new LoginResponseDto();
    response.userId = output.userId;
    response.username = output.username;
    response.token = output.token;
    return response;
  }
}
