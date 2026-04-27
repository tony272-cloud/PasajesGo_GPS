import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TripStatus } from '../../enums/trip-status.enum';

export class StartTripDto {
  @ApiProperty({ example: 'uuid-bus' })
  @IsUUID()
  @IsNotEmpty()
  busId: string;

  @ApiProperty({ example: 'uuid-route' })
  @IsUUID()
  @IsNotEmpty()
  routeId: string;

  // Driver ID can be passed, or if empty, it's inferred from the currently logged in driver
  @ApiPropertyOptional({ example: 'uuid-driver' })
  @IsUUID()
  @IsOptional()
  driverId?: string;
}

export class EndTripDto {
  @ApiProperty({ enum: TripStatus, example: TripStatus.COMPLETED })
  @IsEnum(TripStatus)
  status: TripStatus;
}
