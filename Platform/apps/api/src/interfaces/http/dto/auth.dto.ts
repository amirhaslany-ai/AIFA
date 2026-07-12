import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { AuthSession } from '../../../application/identity.constants';

export class RegisterRequestDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password!: string;
}

export class LoginRequestDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}

export class RefreshRequestDto {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}

export class LogoutRequestDto {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}

export class AuthSessionResponseDto implements AuthSession {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  refreshTokenExpiresAt!: Date;
}
