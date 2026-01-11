import { Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  fundId: Types.ObjectId;
  type: 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';
  amount: number;
  date: Date;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDto {
  fundId: string;
  type: 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';
  amount: number;
  date: Date;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  description?: string;
}

export interface UpdateTransactionDto {
  type?: 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';
  amount?: number;
  date?: Date;
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  description?: string;
}

export interface TransactionResponse {
  _id: string;
  fundId: string;
  fundName?: string;
  type: 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';
  amount: number;
  date: string; // ISO string
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  description?: string;
  createdAt: string; // ISO string (keep as string)
  updatedAt: string; // ISO string (keep as string)
}