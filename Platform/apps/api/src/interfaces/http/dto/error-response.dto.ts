import { ApiProperty } from '@nestjs/swagger';

class ErrorBodyDto {
  @ApiProperty({ description: 'Stable, machine-readable error code (upper snake case).' })
  code!: string;

  @ApiProperty({ description: 'Human-readable message, safe to show a developer consumer.' })
  message!: string;

  @ApiProperty({ description: 'Matches the X-Request-Id response header and log correlation id.' })
  requestId!: string;
}

/** See docs/architecture/api-architecture.md's error shape. */
export class ErrorResponseDto {
  @ApiProperty()
  error!: ErrorBodyDto;
}
