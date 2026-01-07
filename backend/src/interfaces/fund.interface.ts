import { Document } from 'mongoose';

export interface IFund extends Document {
  fundName: string;
  description?: string;
  fundSize: number;
  vintageYear: number;
  managementFee: number;
  carryFee: number;
  currency: 'USD' | 'EUR' | 'GBP';
  createdAt: Date;
  updatedAt: Date;
}