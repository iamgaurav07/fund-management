import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  Min, 
  IsMongoId,
  IsNotEmpty 
} from 'class-validator';

export class CreateInvestmentDto {
  @IsMongoId()
  @IsNotEmpty()
  fundId!: string;

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsNumber()
  @Min(0)
  investedAmount!: number;

  @IsNumber()
  @Min(0)
  currentValue!: number;

  @IsDateString()
  investmentDate!: string;

  @IsEnum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
  currency!: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

  @IsEnum(['ACTIVE', 'EXITED', 'WRITTEN_OFF'])
  @IsOptional()
  status?: 'ACTIVE' | 'EXITED' | 'WRITTEN_OFF';

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateInvestmentDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  investedAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentValue?: number;

  @IsDateString()
  @IsOptional()
  investmentDate?: string;

  @IsEnum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
  @IsOptional()
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

  @IsEnum(['ACTIVE', 'EXITED', 'WRITTEN_OFF'])
  @IsOptional()
  status?: 'ACTIVE' | 'EXITED' | 'WRITTEN_OFF';

  @IsString()
  @IsOptional()
  description?: string;
}