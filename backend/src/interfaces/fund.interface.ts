import { Document } from 'mongoose';
export interface IFund extends Document {
  name: string;
  description?: string;
  fundSize: number;
  vintageYear: number;
  managementFeePercent: number;
  carryPercent: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'LIQUIDATED';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFundDto {
  name: string;
  description?: string;
  fundSize: number;
  vintageYear: number;
  managementFeePercent: number;
  carryPercent: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'LIQUIDATED';
}

export interface UpdateFundDto {
  name?: string;
  description?: string;
  fundSize?: number;
  vintageYear?: number;
  managementFeePercent?: number;
  carryPercent?: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status?: 'DRAFT' | 'OPEN' | 'CLOSED' | 'LIQUIDATED';
}

export interface FundResponse {
  _id: string;
  name: string;
  description?: string;
  fundSize: number;
  vintageYear: number;
  managementFeePercent: number;
  carryPercent: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'LIQUIDATED';
  createdAt: Date;
  updatedAt: Date;
}