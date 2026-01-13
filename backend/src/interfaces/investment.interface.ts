// interfaces/investment.interface.ts
import { Document, Types } from 'mongoose';

export type InvestmentCurrency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
export type InvestmentStatus = 'ACTIVE' | 'EXITED' | 'WRITTEN_OFF';

export interface IInvestment extends Document {
  fundId: Types.ObjectId;
  companyName: string;
  investedAmount: number;
  currentValue: number;
  investmentDate: Date;
  currency: InvestmentCurrency;
  status: InvestmentStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual populated field
  fund?: {
    _id: Types.ObjectId;
    name: string;
    currency: InvestmentCurrency;
  };
}

// For API responses (without mongoose methods)
export interface InvestmentResponse {
  _id: string;
  fundId: string;
  fundName?: string; // Populated field
  companyName: string;
  investedAmount: number;
  currentValue: number;
  investmentDate: string;
  currency: InvestmentCurrency;
  status: InvestmentStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
  
  // Calculated fields (can be added in service layer)
  unrealizedGain?: number;
  roi?: number;
  holdingPeriod?: number;
}

// For creating new investment
export interface CreateInvestmentDto {
  fundId: string;
  companyName: string;
  investedAmount: number;
  currentValue: number;
  investmentDate: string; // ISO string
  currency: InvestmentCurrency;
  status?: InvestmentStatus;
  description?: string;
}

// For updating investment
export interface UpdateInvestmentDto {
  companyName?: string;
  investedAmount?: number;
  currentValue?: number;
  investmentDate?: string; // ISO string
  currency?: InvestmentCurrency;
  status?: InvestmentStatus;
  description?: string;
}

// For investment filters/query
export interface InvestmentFilters {
  fundId?: string;
  status?: InvestmentStatus;
  currency?: InvestmentCurrency;
  minInvestedAmount?: number;
  maxInvestedAmount?: number;
  minCurrentValue?: number;
  maxCurrentValue?: number;
  startDate?: string;
  endDate?: string;
  searchQuery?: string; // For company name search
}

// For investment performance metrics
export interface InvestmentPerformance {
  _id: string;
  companyName: string;
  investedAmount: number;
  currentValue: number;
  unrealizedGain: number;
  roi: number; // Return on Investment in percentage
  holdingPeriod: number; // In days
}

// For fund-level investment summary
export interface FundInvestmentSummary {
  totalInvestments: number;
  totalInvestedAmount: number;
  totalCurrentValue: number;
  totalUnrealizedGain: number;
  averageROI: number;
  activeInvestments: number;
  exitedInvestments: number;
  writtenOffInvestments: number;
}