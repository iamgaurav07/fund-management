import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreateFundDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  fundSize!: number;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  vintageYear!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  managementFeePercent!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  carryPercent!: number;

  @IsEnum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
  currency!: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

  @IsEnum(['DRAFT', 'OPEN', 'CLOSED', 'LIQUIDATED'])
  status!: 'DRAFT' | 'OPEN' | 'CLOSED' | 'LIQUIDATED';
}

export class UpdateFundDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  fundSize?: number;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  @IsOptional()
  vintageYear?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  managementFeePercent?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  carryPercent?: number;

  @IsEnum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
  @IsOptional()
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

  @IsEnum(['DRAFT', 'OPEN', 'CLOSED', 'LIQUIDATED'])
  @IsOptional()
  status?: 'DRAFT' | 'OPEN' | 'CLOSED' | 'LIQUIDATED';
}