export interface Investment {
  id: string;
  fundId: string;
  companyName: string;
  investedAmount: number;
  currentValue: number;
  date: string;
  description?: string;
}

export interface InvestmentFormData {
  fundId: string;
  companyName: string;
  investedAmount: number | '';
  currentValue: number | '';
  date: string;
  description: string;
}
