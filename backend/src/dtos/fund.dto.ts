import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreateFundDto {
  @IsString()
  fundName!: string;

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
  managementFee!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  carry!: number;

  @IsEnum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
  currency!: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

  @IsEnum([0, 1, 2, 3])
  status!: 0 | 1 | 2 | 3;
}

export class UpdateFundDto {
  @IsString()
  @IsOptional()
  fundName?: string;

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
  managementFee?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  carry?: number;

  @IsEnum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
  @IsOptional()
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

  @IsEnum([0, 1, 2, 3])
  @IsOptional()
  status?: 0 | 1 | 2 | 3;
}