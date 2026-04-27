import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertType } from '../../enums/alert-type.enum';

export class CreateGeofenceDto {
  @ApiProperty({ example: 'Zona Universitaria' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'uuid-org' })
  @IsString()
  @IsOptional()
  organizationId?: string;

  @ApiProperty({ description: 'GeoJSON Polygon coordinates array', example: [[[-77.0,-12.0], [-77.1,-12.0], [-77.1,-12.1], [-77.0,-12.1], [-77.0,-12.0]]] })
  @IsArray()
  @IsNotEmpty()
  polygonCoordinates: number[][][];

  @ApiProperty({ enum: AlertType, example: AlertType.GEOFENCE_ENTER })
  @IsEnum(AlertType)
  alertType: AlertType;
}

export class UpdateGeofenceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  polygonCoordinates?: number[][][];

  @ApiPropertyOptional({ enum: AlertType })
  @IsEnum(AlertType)
  @IsOptional()
  alertType?: AlertType;
}
