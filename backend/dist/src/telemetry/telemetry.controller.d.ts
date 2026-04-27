import { TelemetryService } from './telemetry.service';
import { TelemetryBatchDto } from './dto/telemetry.dto';
export declare class TelemetryController {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    ingest(deviceToken: string, batchDto: TelemetryBatchDto): Promise<{
        inserted: number;
    }>;
}
