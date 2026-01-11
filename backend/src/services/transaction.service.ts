import { CreateTransactionDto, UpdateTransactionDto } from '../dtos/transaction.dto';
import { HttpException } from '../exceptions/http.exception';
import Transaction from '../models/transaction.model';
import Fund from '../models/fund.model';
import { isEmpty } from '../utils/util';
import { TransactionResponse } from '../interfaces/transaction.interface';
import { Types } from 'mongoose';

// Interface for populated lean document
interface PopulatedTransaction {
  _id: Types.ObjectId;
  fundId: Types.ObjectId;
  fund?: {
    _id: Types.ObjectId;
    name: string;
  };
  type: 'CAPITAL_CALL' | 'INVESTMENT' | 'DISTRIBUTION';
  amount: number;
  date: Date;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export class TransactionService {
  public async findAllTransactions(): Promise<TransactionResponse[]> {
    const transactions = await Transaction.find()
      .populate<{ fund: { _id: Types.ObjectId; name: string } }>('fund', 'name')
      .sort({ date: -1 })
      .lean<PopulatedTransaction[]>();

    return transactions.map((transaction) => ({
      _id: transaction._id.toString(),
      fundId: transaction.fundId.toString(),
      fundName: transaction.fund?.name,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date.toISOString(),
      currency: transaction.currency,
      description: transaction.description,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    }));
  }

  public async findTransactionsByFundId(fundId: string): Promise<TransactionResponse[]> {
    if (isEmpty(fundId)) {
      throw new HttpException(400, 'Fund ID is required');
    }

    const transactions = await Transaction.find({ fundId })
      .populate<{ fund: { _id: Types.ObjectId; name: string } }>('fund', 'name')
      .sort({ date: -1 })
      .lean<PopulatedTransaction[]>();

    return transactions.map((transaction) => ({
      _id: transaction._id.toString(),
      fundId: transaction.fundId.toString(),
      fundName: transaction.fund?.name,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date.toISOString(),
      currency: transaction.currency,
      description: transaction.description,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    }));
  }

  public async findTransactionById(transactionId: string): Promise<TransactionResponse> {
    if (isEmpty(transactionId)) {
      throw new HttpException(400, 'Transaction ID is required');
    }

    const transaction = await Transaction.findById(transactionId)
      .populate<{ fund: { _id: Types.ObjectId; name: string } }>('fund', 'name')
      .lean<PopulatedTransaction>();

    if (!transaction) {
      throw new HttpException(404, 'Transaction not found');
    }

    return {
      _id: transaction._id.toString(),
      fundId: transaction.fundId.toString(),
      fundName: transaction.fund?.name,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date.toISOString(),
      currency: transaction.currency,
      description: transaction.description,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }

  public async createTransaction(transactionData: CreateTransactionDto): Promise<TransactionResponse> {
    if (isEmpty(transactionData)) {
      throw new HttpException(400, 'Transaction data is empty');
    }

    // Verify fund exists
    const fund = await Fund.findById(transactionData.fundId);
    if (!fund) {
      throw new HttpException(404, 'Fund not found');
    }

    // Convert string date to Date object
    const transactionWithDate = {
      ...transactionData,
      date: new Date(transactionData.date)
    };

    const createdTransaction = await Transaction.create(transactionWithDate);

    // Populate to get fund name
    const populatedTransaction = await Transaction.findById(createdTransaction._id)
      .populate<{ fund: { _id: Types.ObjectId; name: string } }>('fund', 'name')
      .lean<PopulatedTransaction>();

    if (!populatedTransaction) {
      throw new HttpException(500, 'Failed to create transaction');
    }

    return {
      _id: populatedTransaction._id.toString(),
      fundId: populatedTransaction.fundId.toString(),
      fundName: populatedTransaction.fund?.name,
      type: populatedTransaction.type,
      amount: populatedTransaction.amount,
      date: populatedTransaction.date.toISOString(),
      currency: populatedTransaction.currency,
      description: populatedTransaction.description,
      createdAt: populatedTransaction.createdAt.toISOString(),
      updatedAt: populatedTransaction.updatedAt.toISOString(),
    };
  }

  public async updateTransaction(transactionId: string, transactionData: UpdateTransactionDto): Promise<TransactionResponse> {
    if (isEmpty(transactionData)) {
      throw new HttpException(400, 'Transaction data is empty');
    }

    // Create update object without undefined fields
    const updateData: any = {};
    if (transactionData.type) updateData.type = transactionData.type;
    if (transactionData.amount !== undefined) updateData.amount = transactionData.amount;
    if (transactionData.date) updateData.date = new Date(transactionData.date);
    if (transactionData.currency) updateData.currency = transactionData.currency;
    if (transactionData.description !== undefined) updateData.description = transactionData.description;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    )
    .populate<{ fund: { _id: Types.ObjectId; name: string } }>('fund', 'name')
    .lean<PopulatedTransaction>();

    if (!updatedTransaction) {
      throw new HttpException(404, 'Transaction not found');
    }

    return {
      _id: updatedTransaction._id.toString(),
      fundId: updatedTransaction.fundId.toString(),
      fundName: updatedTransaction.fund?.name,
      type: updatedTransaction.type,
      amount: updatedTransaction.amount,
      date: updatedTransaction.date.toISOString(),
      currency: updatedTransaction.currency,
      description: updatedTransaction.description,
      createdAt: updatedTransaction.createdAt.toISOString(),
      updatedAt: updatedTransaction.updatedAt.toISOString(),
    };
  }

  public async deleteTransaction(transactionId: string): Promise<{ message: string }> {
    if (isEmpty(transactionId)) {
      throw new HttpException(400, 'Transaction ID is required');
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
    if (!deletedTransaction) {
      throw new HttpException(404, 'Transaction not found');
    }

    return { message: 'Transaction deleted successfully' };
  }

  public async getTransactionSummary(fundId: string): Promise<{
    totalCapitalCalls: number;
    totalInvestments: number;
    totalDistributions: number;
    netCashFlow: number;
  }> {
    if (isEmpty(fundId)) {
      throw new HttpException(400, 'Fund ID is required');
    }

    const transactions = await Transaction.find({ fundId }).lean();

    let totalCapitalCalls = 0;
    let totalInvestments = 0;
    let totalDistributions = 0;

    transactions.forEach(transaction => {
      switch (transaction.type) {
        case 'CAPITAL_CALL':
          totalCapitalCalls += transaction.amount;
          break;
        case 'INVESTMENT':
          totalInvestments += transaction.amount;
          break;
        case 'DISTRIBUTION':
          totalDistributions += transaction.amount;
          break;
      }
    });

    // Net cash flow formula: (Distributions + Investments) - Capital Calls
    const netCashFlow = (totalDistributions + totalInvestments) - totalCapitalCalls;

    return {
      totalCapitalCalls,
      totalInvestments,
      totalDistributions,
      netCashFlow,
    };
  }

  public async getTransactionsByDateRange(
    fundId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<TransactionResponse[]> {
    const transactions = await Transaction.find({
      fundId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate<{ fund: { _id: Types.ObjectId; name: string } }>('fund', 'name')
    .sort({ date: 1 })
    .lean<PopulatedTransaction[]>();

    return transactions.map((transaction) => ({
      _id: transaction._id.toString(),
      fundId: transaction.fundId.toString(),
      fundName: transaction.fund?.name,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date.toISOString(),
      currency: transaction.currency,
      description: transaction.description,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    }));
  }
}