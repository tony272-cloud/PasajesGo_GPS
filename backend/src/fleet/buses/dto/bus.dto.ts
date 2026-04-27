import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusStatus } from '../../enums/bus-status.enum';

export class CreateBusDto {
  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiPropertyOptional({ example: 'Volvo B7R' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ example: 40 })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ example: 'uuid-org-id' })
  @IsString()
  @IsOptional()
  organizationId?: string;
}

export class UpdateBusDto {
  @ApiPropertyOptional({ example: 'ABC-1234' })
  @IsString()
  @IsOptional()
  plate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ enum: BusStatus })
  @IsEnum(BusStatus)
  @IsOptional()
  status?: BusStatus;
}
