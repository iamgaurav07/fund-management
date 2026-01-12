export type TransactionType = 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

// Transaction interface matching your model
export interface Transaction {
  _id?: string; // Changed from id to _id to match MongoDB
  fundId: string;
  type: TransactionType;
  amount: number;
  currency: Currency; // Expanded to all currency types
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Optional populated field
  fundName?: string;
}

// For form data (frontend usage)
export interface TransactionFormData {
  _id?: string;
  fundId: string;
  type?: TransactionType;
  amount?: number | '';
  currency?: Currency;
  date?: string;
  description?: string;
}

// For API requests
export interface CreateTransactionRequest {
  fundId: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  date: string; // ISO string
  description?: string;
}

export interface UpdateTransactionRequest {
  type?: TransactionType;
  amount?: number;
  currency?: Currency;
  date?: string;
  description?: string;
}