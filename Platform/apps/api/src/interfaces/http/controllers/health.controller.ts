import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { GetSystemHealthUseCase } from '../../../application/use-cases/get-system-health.use-case';
import { HealthResponseDto } from '../dto/health-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly getSystemHealth: GetSystemHealthUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Liveness — process is up.' })
  @ApiResponse({ status: 200, description: 'Always returns ok if the process can respond at all.' })
  liveness(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness — database, Redis, and AI providers are reachable.' })
  @ApiResponse({ status: 200, type: HealthResponseDto, description: 'status is "ok" or "degraded"' })
  @ApiResponse({ status: 503, type: HealthResponseDto, description: 'status is "down" — database unreachable or all providers unavailable' })
  async readiness(@Res({ passthrough: true }) res: Response): Promise<HealthResponseDto> {
    const health = await this.getSystemHealth.execute();

    // 04_PATCH_LIST.md P1-3: previously always 200 regardless of `status`, so
    // an orchestrator's readiness probe (which checks the HTTP status code,
    // not the JSON body) would route traffic here even when truly down.
    if (health.status === 'down') {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }

    return health;
  }
}
