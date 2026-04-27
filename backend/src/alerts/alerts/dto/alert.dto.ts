import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertType } from '../../enums/alert-type.enum';

export class CreateAlertDto {
  @ApiProperty({ example: 'uuid-bus' })
  @IsUUID()
  @IsNotEmpty()
  busId: string;

  @ApiPropertyOptional({ example: 'uuid-trip' })
  @IsUUID()
  @IsOptional()
  tripId?: string;

  @ApiProperty({ enum: AlertType })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiProperty({ example: 'El bus excedió la geocerca de velocidad' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ example: 'POINT(-77.0 -12.0)', description: 'WKT Point of the alert' })
  @IsString()
  @IsOptional()
  geomWkt?: string;
  
  @ApiPropertyOptional({ example: 'uuid-org' })
  @IsString()
  @IsOptional()
  organizationId?: string;
}
