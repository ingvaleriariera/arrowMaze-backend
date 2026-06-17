import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'johnDoe',
    description: 'Username (3-30 characters, letters, numbers, underscores)',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
