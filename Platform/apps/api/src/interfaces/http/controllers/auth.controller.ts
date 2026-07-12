import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterAccountUseCase } from '../../../application/use-cases/register-account.use-case';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { RefreshSessionUseCase } from '../../../application/use-cases/refresh-session.use-case';
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case';
import {
  AuthSessionResponseDto,
  LoginRequestDto,
  LogoutRequestDto,
  RefreshRequestDto,
  RegisterRequestDto,
} from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentAccount } from '../decorators/current-account.decorator';
import type { AuthenticatedPrincipal } from '../../../application/ports/auth-guard.port';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerAccount: RegisterAccountUseCase,
    private readonly login: LoginUseCase,
    private readonly refreshSession: RefreshSessionUseCase,
    private readonly logout: LogoutUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Create an account and start a session.' })
  @ApiResponse({ status: 201, type: AuthSessionResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async registerRoute(@Body() body: RegisterRequestDto): Promise<AuthSessionResponseDto> {
    return this.registerAccount.execute(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate with email + password.' })
  @ApiResponse({ status: 200, type: AuthSessionResponseDto })
  @HttpCode(HttpStatus.OK)
  async loginRoute(@Body() body: LoginRequestDto): Promise<AuthSessionResponseDto> {
    return this.login.execute(body);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rotate a refresh token for a new access/refresh pair.' })
  @ApiResponse({ status: 200, type: AuthSessionResponseDto })
  @HttpCode(HttpStatus.OK)
  async refreshRoute(@Body() body: RefreshRequestDto): Promise<AuthSessionResponseDto> {
    return this.refreshSession.execute(body.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Revoke a session (idempotent).' })
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutRoute(@Body() body: LogoutRequestDto): Promise<void> {
    await this.logout.execute(body.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Whoever the current access token belongs to.' })
  @ApiResponse({ status: 200, description: '{ accountId: string }' })
  me(@CurrentAccount() principal: AuthenticatedPrincipal): AuthenticatedPrincipal {
    return principal;
  }
}
