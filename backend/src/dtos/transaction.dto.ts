import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  Min, 
  IsMongoId 
} from 'class-validator';

export class CreateTransactionDto {
  @IsMongoId()
  fundId!: string;

  @IsEnum(['CAPITAL_CALL', 'INVESTMENT', 'DISTRIBUTION'])
  type!: 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsDateString()
  date!: string;

  @IsEnum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
  currency!: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTransactionDto {
  @IsEnum(['CAPITAL_CALL', 'INVESTMENT', 'DISTRIBUTION'])
  @IsOptional()
  type?: 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsEnum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
  @IsOptional()
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

  @IsString()
  @IsOptional()
  description?: string;
}