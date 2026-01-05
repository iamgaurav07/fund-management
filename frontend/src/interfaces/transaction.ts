export type TransactionType = 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';

export interface Transaction {
  id: string;
  fundId: string;
  type: TransactionType;
  amount: number;
  currency: 'USD' | 'EUR';
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  fundId: string;
  type: TransactionType;
  amount: number | '';
  currency: 'USD' | 'EUR';
  date: string;
  description?: string;
}

export interface Fund {
  id: string;
  name: string;
  currency: 'USD' | 'EUR';
}