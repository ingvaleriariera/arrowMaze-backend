import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description:
      'Email address OR username (field keeps its historical name for ' +
      'backward compatibility). Values containing @ are resolved as an ' +
      'email, anything else as a username.',
  })
  @IsString()
  @MinLength(3)
  email: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
