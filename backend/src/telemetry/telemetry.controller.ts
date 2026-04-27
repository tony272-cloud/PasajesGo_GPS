import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';
import { TelemetryBatchDto } from './dto/telemetry.dto';

@ApiTags('Telemetry')
@Controller('api/v1/telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  @ApiOperation({ summary: 'Ingesta de telemetría por lotes desde los dispositivos GPS/Móvil' })
  @ApiHeader({ name: 'x-device-token', description: 'Token único del dispositivo del bus', required: true })
  async ingest(@Headers('x-device-token') deviceToken: string, @Body() batchDto: TelemetryBatchDto) {
    if (!deviceToken) {
      throw new UnauthorizedException('Missing x-device-token header');
    }
    return this.telemetryService.ingestBatch(deviceToken, batchDto);
  }
}
