export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';
export type FundStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'LIQUIDATED';

export interface Fund {
  id: string;
  name: string;
  fundSize: number;
  currency: Currency;
  vintageYear: number;
  managementFeePercent: number;
  carryPercent: number;
  status: FundStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundFormData {
  name: string;
  fundSize: number | '';
  currency: Currency;
  vintageYear: number | '';
  managementFeePercent: number | '';
  carryPercent: number | '';
  status: FundStatus;
  description?: string;
}

export interface FundValidationErrors {
  name?: string;
  fundSize?: string;
  currency?: string;
  vintageYear?: string;
  managementFeePercent?: string;
  carryPercent?: string;
  status?: string;
}