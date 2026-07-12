import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Readiness — dependencies (providers) are reachable.' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async readiness(): Promise<HealthResponseDto> {
    return this.getSystemHealth.execute();
  }
}
