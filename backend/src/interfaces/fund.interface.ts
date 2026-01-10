import { Document } from 'mongoose';
export interface IFund extends Document {
  fundName: string;
  description?: string;
  fundSize: number;
  vintageYear: number;
  managementFee: number;
  carry: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status: 0 | 1 | 2 | 3;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFundDto {
  fundName: string;
  description?: string;
  fundSize: number;
  vintageYear: number;
  managementFee: number;
  carry: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status: 0 | 1 | 2 | 3;
}

export interface UpdateFundDto {
  fundName?: string;
  description?: string;
  fundSize?: number;
  vintageYear?: number;
  managementFee?: number;
  carry?: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status?: 0 | 1 | 2 | 3;
}

export interface FundResponse {
  _id: string;
  fundName: string;
  description?: string;
  fundSize: number;
  vintageYear: number;
  managementFee: number;
  carry: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status: 0 | 1 | 2 | 3;
  createdAt: Date;
  updatedAt: Date;
}