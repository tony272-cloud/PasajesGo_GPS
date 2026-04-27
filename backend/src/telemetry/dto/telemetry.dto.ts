import { IsArray, IsDateString, IsNumber, IsOptional, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PositionDto {
  @ApiProperty({ example: '2026-03-14T10:00:00Z' })
  @IsDateString()
  ts: Date;

  @ApiProperty({ example: -77.02824 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({ example: -12.04318 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiPropertyOptional({ example: 45.5, description: 'Speed in km/h' })
  @IsNumber()
  @Min(0)
  @Max(150) // Reasonable max speed for a bus
  @IsOptional()
  speedKmh?: number;

  @ApiPropertyOptional({ example: 120, description: 'Heading in degrees' })
  @IsNumber()
  @Min(0)
  @Max(360)
  @IsOptional()
  headingDeg?: number;

  @ApiPropertyOptional({ example: 10, description: 'GPS Accuracy in meters' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  accuracyM?: number;
}

export class TelemetryBatchDto {
  @ApiProperty({ example: 'uuid-bus' })
  @IsUUID()
  busId: string;

  @ApiPropertyOptional({ example: 'uuid-trip' })
  @IsUUID()
  @IsOptional()
  tripId?: string;

  @ApiProperty({ type: [PositionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionDto)
  positions: PositionDto[];
}
