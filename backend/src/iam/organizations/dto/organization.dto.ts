import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Transportes Rápidos', description: 'Nombre de la organización' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '20123456789', description: 'RUC o Tax ID' })
  @IsString()
  @IsNotEmpty()
  rucOrTaxId: string;

  @ApiPropertyOptional({ example: 'contacto@transportes.com', description: 'Email de contacto' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rucOrTaxId?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  contactEmail?: string;
}
