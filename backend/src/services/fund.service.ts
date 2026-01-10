import { CreateFundDto, UpdateFundDto } from '../dtos/fund.dto';
import { HttpException } from '../exceptions/http.exception';
import Fund from '../models/fund.model';
import { isEmpty } from '../utils/util';
import { FundResponse } from '../interfaces/fund.interface';

export class FundService {
  public async findAllFunds(): Promise<FundResponse[]> {
    const funds = await Fund.find().lean();
    return funds.map((fund) => ({
      _id: fund._id.toString(),
      name: fund.name,
      description: fund.description,
      fundSize: fund.fundSize,
      vintageYear: fund.vintageYear,
      managementFeePercent: fund.managementFeePercent,
      carryPercent: fund.carryPercent,
      currency: fund.currency,
      status: fund.status,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
    }));
  }

  public async findFundById(fundId: string): Promise<FundResponse> {
    if (isEmpty(fundId)) {
      throw new HttpException(400, 'Fund ID is required');
    }

    const fund = await Fund.findById(fundId).lean();
    if (!fund) {
      throw new HttpException(404, 'Fund not found');
    }

    return {
      _id: fund._id.toString(),
      name: fund.name,
      description: fund.description,
      fundSize: fund.fundSize,
      vintageYear: fund.vintageYear,
      managementFeePercent: fund.managementFeePercent,
      carryPercent: fund.carryPercent,
      currency: fund.currency,
      status: fund.status,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
    };
  }

  public async createFund(fundData: CreateFundDto): Promise<FundResponse> {
    if (isEmpty(fundData)) {
      throw new HttpException(400, 'Fund data is empty');
    }

    // Check if fund with same name already exists
    const existingFund = await Fund.findOne({ fundName: fundData.name });
    if (existingFund) {
      throw new HttpException(409, `Fund with name "${fundData.name}" already exists`);
    }

    const createdFund = await Fund.create(fundData);

    return {
      _id: createdFund._id.toString(),
      name: createdFund.name,
      description: createdFund.description,
      fundSize: createdFund.fundSize,
      vintageYear: createdFund.vintageYear,
      managementFeePercent: createdFund.managementFeePercent,
      carryPercent: createdFund.carryPercent,
      currency: createdFund.currency,
      status: createdFund.status,
      createdAt: createdFund.createdAt,
      updatedAt: createdFund.updatedAt,
    };
  }

  public async updateFund(fundId: string, fundData: UpdateFundDto): Promise<FundResponse> {
    if (isEmpty(fundData)) {
      throw new HttpException(400, 'Fund data is empty');
    }

    // Check if fund name is being updated and if it already exists
    if (fundData.name) {
      const existingFund = await Fund.findOne({
        fundName: fundData.name,
        _id: { $ne: fundId },
      });
      if (existingFund) {
        throw new HttpException(409, `Fund with name "${fundData.name}" already exists`);
      }
    }

    // Create update object without undefined fields
    const updateData: any = {};
    if (fundData.name) updateData.name = fundData.name;
    if (fundData.description !== undefined) updateData.description = fundData.description;
    if (fundData.fundSize !== undefined) updateData.fundSize = fundData.fundSize;
    if (fundData.vintageYear !== undefined) updateData.vintageYear = fundData.vintageYear;
    if (fundData.managementFeePercent !== undefined) updateData.managementFeePercent = fundData.managementFeePercent;
    if (fundData.carryPercent !== undefined) updateData.carryPercent = fundData.carryPercent;
    if (fundData.currency) updateData.currency = fundData.currency;
    if (fundData.status !== undefined) updateData.status = fundData.status;

    const updatedFund = await Fund.findByIdAndUpdate(fundId, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedFund) {
      throw new HttpException(404, 'Fund not found');
    }

    return {
      _id: updatedFund._id.toString(),
      name: updatedFund.name,
      description: updatedFund.description,
      fundSize: updatedFund.fundSize,
      vintageYear: updatedFund.vintageYear,
      managementFeePercent: updatedFund.managementFeePercent,
      carryPercent: updatedFund.carryPercent,
      currency: updatedFund.currency,
      status: updatedFund.status,
      createdAt: updatedFund.createdAt,
      updatedAt: updatedFund.updatedAt,
    };
  }

  public async deleteFund(fundId: string): Promise<{ message: string }> {
    if (isEmpty(fundId)) {
      throw new HttpException(400, 'Fund ID is required');
    }

    const deletedFund = await Fund.findByIdAndDelete(fundId);
    if (!deletedFund) {
      throw new HttpException(404, 'Fund not found');
    }

    return { message: 'Fund deleted successfully' };
  }

  // Optional: Get funds with filters
  public async findFundsWithFilters(filters: {
    status?: number;
    currency?: string;
    minFundSize?: number;
    maxFundSize?: number;
    vintageYear?: number;
  }): Promise<FundResponse[]> {
    const query: any = {};

    if (filters.status !== undefined) query.status = filters.status;
    if (filters.currency) query.currency = filters.currency;
    if (filters.vintageYear) query.vintageYear = filters.vintageYear;

    if (filters.minFundSize !== undefined || filters.maxFundSize !== undefined) {
      query.fundSize = {};
      if (filters.minFundSize !== undefined) query.fundSize.$gte = filters.minFundSize;
      if (filters.maxFundSize !== undefined) query.fundSize.$lte = filters.maxFundSize;
    }

    const funds = await Fund.find(query).lean();
    return funds.map((fund) => ({
      _id: fund._id.toString(),
      name: fund.name,
      description: fund.description,
      fundSize: fund.fundSize,
      vintageYear: fund.vintageYear,
      managementFeePercent: fund.managementFeePercent,
      carryPercent: fund.carryPercent,
      currency: fund.currency,
      status: fund.status,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
    }));
  }
}