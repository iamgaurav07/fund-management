import { CreateInvestmentDto, UpdateInvestmentDto } from '../dtos/investment.dto';
import { HttpException } from '../exceptions/http.exception';
import Investment from '../models/investment.model';
import Fund from '../models/fund.model';
import { isEmpty } from '../utils/util';
import { InvestmentResponse, InvestmentPerformance, FundInvestmentSummary } from '../interfaces/investment.interface';
import { Types } from 'mongoose';

interface PopulatedInvestment {
  _id: Types.ObjectId;
  fundId: Types.ObjectId;
  fund?: {
    _id: Types.ObjectId;
    name: string;
    currency: string;
  };
  companyName: string;
  investedAmount: number;
  currentValue: number;
  investmentDate: Date;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  status: 'ACTIVE' | 'EXITED' | 'WRITTEN_OFF';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export class InvestmentService {
  public async findAllInvestments(): Promise<InvestmentResponse[]> {
    const investments = await Investment.find()
      .populate<{ fund: { _id: Types.ObjectId; name: string; currency: string } }>('fund', 'name currency')
      .sort({ investmentDate: -1 })
      .lean<PopulatedInvestment[]>();

    return investments.map(this.mapToInvestmentResponse);
  }

  public async findInvestmentsByFundId(fundId: string): Promise<InvestmentResponse[]> {
    if (isEmpty(fundId)) {
      throw new HttpException(400, 'Fund ID is required');
    }

    const investments = await Investment.find({ fundId })
      .populate<{ fund: { _id: Types.ObjectId; name: string; currency: string } }>('fund', 'name currency')
      .sort({ investmentDate: -1 })
      .lean<PopulatedInvestment[]>();

    return investments.map(this.mapToInvestmentResponse);
  }

  public async findInvestmentById(investmentId: string): Promise<InvestmentResponse> {
    if (isEmpty(investmentId)) {
      throw new HttpException(400, 'Investment ID is required');
    }

    const investment = await Investment.findById(investmentId)
      .populate<{ fund: { _id: Types.ObjectId; name: string; currency: string } }>('fund', 'name currency')
      .lean<PopulatedInvestment>();

    if (!investment) {
      throw new HttpException(404, 'Investment not found');
    }

    return this.mapToInvestmentResponse(investment);
  }

  public async createInvestment(investmentData: CreateInvestmentDto): Promise<InvestmentResponse> {
    if (isEmpty(investmentData)) {
      throw new HttpException(400, 'Investment data is empty');
    }

    // Verify fund exists
    const fund = await Fund.findById(investmentData.fundId);
    if (!fund) {
      throw new HttpException(404, 'Fund not found');
    }

    // Convert string date to Date object
    const investmentWithDate = {
      ...investmentData,
      investmentDate: new Date(investmentData.investmentDate),
      status: investmentData.status || 'ACTIVE'
    };

    const createdInvestment = await Investment.create(investmentWithDate);

    // Populate to get fund details
    const populatedInvestment = await Investment.findById(createdInvestment._id)
      .populate<{ fund: { _id: Types.ObjectId; name: string; currency: string } }>('fund', 'name currency')
      .lean<PopulatedInvestment>();

    if (!populatedInvestment) {
      throw new HttpException(500, 'Failed to create investment');
    }

    return this.mapToInvestmentResponse(populatedInvestment);
  }

  public async updateInvestment(investmentId: string, investmentData: UpdateInvestmentDto): Promise<InvestmentResponse> {
    if (isEmpty(investmentData)) {
      throw new HttpException(400, 'Investment data is empty');
    }

    // Create update object without undefined fields
    const updateData: any = {};
    if (investmentData.companyName) updateData.companyName = investmentData.companyName;
    if (investmentData.investedAmount !== undefined) updateData.investedAmount = investmentData.investedAmount;
    if (investmentData.currentValue !== undefined) updateData.currentValue = investmentData.currentValue;
    if (investmentData.investmentDate) updateData.investmentDate = new Date(investmentData.investmentDate);
    if (investmentData.currency) updateData.currency = investmentData.currency;
    if (investmentData.status) updateData.status = investmentData.status;
    if (investmentData.description !== undefined) updateData.description = investmentData.description;

    const updatedInvestment = await Investment.findByIdAndUpdate(
      investmentId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
    .populate<{ fund: { _id: Types.ObjectId; name: string; currency: string } }>('fund', 'name currency')
    .lean<PopulatedInvestment>();

    if (!updatedInvestment) {
      throw new HttpException(404, 'Investment not found');
    }

    return this.mapToInvestmentResponse(updatedInvestment);
  }

  public async deleteInvestment(investmentId: string): Promise<{ message: string }> {
    if (isEmpty(investmentId)) {
      throw new HttpException(400, 'Investment ID is required');
    }

    const deletedInvestment = await Investment.findByIdAndDelete(investmentId);
    if (!deletedInvestment) {
      throw new HttpException(404, 'Investment not found');
    }

    return { message: 'Investment deleted successfully' };
  }

  public async getInvestmentPerformance(investmentId: string): Promise<InvestmentPerformance> {
    const investment = await this.findInvestmentById(investmentId);
    
    const unrealizedGain = investment.currentValue - investment.investedAmount;
    const roi = (unrealizedGain / investment.investedAmount) * 100;
    const holdingPeriod = Math.floor(
      (new Date().getTime() - new Date(investment.investmentDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      _id: investment._id,
      companyName: investment.companyName,
      investedAmount: investment.investedAmount,
      currentValue: investment.currentValue,
      unrealizedGain,
      roi,
      holdingPeriod,
    };
  }

  public async getFundInvestmentSummary(fundId: string): Promise<FundInvestmentSummary> {
    if (isEmpty(fundId)) {
      throw new HttpException(400, 'Fund ID is required');
    }

    const investments = await Investment.find({ fundId }).lean();

    let totalInvestedAmount = 0;
    let totalCurrentValue = 0;
    let activeInvestments = 0;
    let exitedInvestments = 0;
    let writtenOffInvestments = 0;

    investments.forEach(investment => {
      totalInvestedAmount += investment.investedAmount;
      totalCurrentValue += investment.currentValue;
      
      switch (investment.status) {
        case 'ACTIVE':
          activeInvestments++;
          break;
        case 'EXITED':
          exitedInvestments++;
          break;
        case 'WRITTEN_OFF':
          writtenOffInvestments++;
          break;
      }
    });

    const totalUnrealizedGain = totalCurrentValue - totalInvestedAmount;
    const averageROI = totalInvestedAmount > 0 ? (totalUnrealizedGain / totalInvestedAmount) * 100 : 0;

    return {
      totalInvestments: investments.length,
      totalInvestedAmount,
      totalCurrentValue,
      totalUnrealizedGain,
      averageROI,
      activeInvestments,
      exitedInvestments,
      writtenOffInvestments,
    };
  }

  public async searchInvestments(query: string, filters?: {
    fundId?: string;
    status?: string;
    currency?: string;
  }): Promise<InvestmentResponse[]> {
    const searchQuery: any = {};

    // Text search on company name
    if (query) {
      searchQuery.companyName = { $regex: query, $options: 'i' };
    }

    // Apply filters
    if (filters?.fundId) searchQuery.fundId = filters.fundId;
    if (filters?.status) searchQuery.status = filters.status;
    if (filters?.currency) searchQuery.currency = filters.currency;

    const investments = await Investment.find(searchQuery)
      .populate<{ fund: { _id: Types.ObjectId; name: string; currency: string } }>('fund', 'name currency')
      .sort({ investmentDate: -1 })
      .lean<PopulatedInvestment[]>();

    return investments.map(this.mapToInvestmentResponse);
  }

  public async getInvestmentsWithFilters(filters: {
    fundId?: string;
    status?: string;
    currency?: string;
    minInvestedAmount?: number;
    maxInvestedAmount?: number;
    minCurrentValue?: number;
    maxCurrentValue?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<InvestmentResponse[]> {
    const query: any = {};

    if (filters.fundId) query.fundId = filters.fundId;
    if (filters.status) query.status = filters.status;
    if (filters.currency) query.currency = filters.currency;

    // Amount range filters
    if (filters.minInvestedAmount !== undefined || filters.maxInvestedAmount !== undefined) {
      query.investedAmount = {};
      if (filters.minInvestedAmount !== undefined) query.investedAmount.$gte = filters.minInvestedAmount;
      if (filters.maxInvestedAmount !== undefined) query.investedAmount.$lte = filters.maxInvestedAmount;
    }

    // Value range filters
    if (filters.minCurrentValue !== undefined || filters.maxCurrentValue !== undefined) {
      query.currentValue = {};
      if (filters.minCurrentValue !== undefined) query.currentValue.$gte = filters.minCurrentValue;
      if (filters.maxCurrentValue !== undefined) query.currentValue.$lte = filters.maxCurrentValue;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      query.investmentDate = {};
      if (filters.startDate) query.investmentDate.$gte = filters.startDate;
      if (filters.endDate) query.investmentDate.$lte = filters.endDate;
    }

    const investments = await Investment.find(query)
      .populate<{ fund: { _id: Types.ObjectId; name: string; currency: string } }>('fund', 'name currency')
      .sort({ investmentDate: -1 })
      .lean<PopulatedInvestment[]>();

    return investments.map(this.mapToInvestmentResponse);
  }

  private mapToInvestmentResponse(investment: PopulatedInvestment): InvestmentResponse {
    const unrealizedGain = investment.currentValue - investment.investedAmount;
    const roi = (unrealizedGain / investment.investedAmount) * 100;
    const holdingPeriod = Math.floor(
      (new Date().getTime() - new Date(investment.investmentDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      _id: investment._id.toString(),
      fundId: investment.fundId.toString(),
      fundName: investment.fund?.name,
      companyName: investment.companyName,
      investedAmount: investment.investedAmount,
      currentValue: investment.currentValue,
      investmentDate: investment.investmentDate.toISOString(),
      currency: investment.currency,
      status: investment.status,
      description: investment.description,
      createdAt: investment.createdAt.toISOString(),
      updatedAt: investment.updatedAt.toISOString(),
      unrealizedGain,
      roi,
      holdingPeriod,
    };
  }
}