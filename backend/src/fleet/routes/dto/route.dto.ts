import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StopDto {
  @ApiProperty({ example: 'Parada Sur' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  sequenceOrder: number;

  @ApiProperty({ example: -77.02824 })
  @IsNumber()
  lng: number;

  @ApiProperty({ example: -12.04318 })
  @IsNumber()
  lat: number;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  radiusMeters?: number;
}

export class CreateRouteDto {
  @ApiProperty({ example: 'Línea 1 Sur-Norte' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '#FF0000' })
  @IsString()
  @IsOptional()
  colorHex?: string;

  @ApiPropertyOptional({ example: 'uuid-org' })
  @IsString()
  @IsOptional()
  organizationId?: string;

  @ApiPropertyOptional({ type: [StopDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StopDto)
  @IsOptional()
  stops?: StopDto[];

  @ApiPropertyOptional({ description: 'GeoJSON LineString array of coordinates', example: [[-77.0,-12.0], [-77.1,-12.1]] })
  @IsArray()
  @IsOptional()
  pathCoordinates?: number[][];
}

export class ReorderStopsDto {
  @ApiProperty({ description: 'Array of Stop IDs in the new order' })
  @IsArray()
  @IsString({ each: true })
  stopIds: string[];
}
