import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
  private transactionService = new TransactionService();

  // Get all transactions
  public getTransactions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactions = await this.transactionService.findAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  // Get transactions by fund ID
  public getTransactionsByFundId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundId = req.params.fundId;
      const transactions = await this.transactionService.findTransactionsByFundId(fundId);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };

  // Get transaction by ID
  public getTransactionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionId = req.params.id;
      const transaction = await this.transactionService.findTransactionById(transactionId);
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  };

  // Create new transaction
  public createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionData = req.body;
      const createdTransaction = await this.transactionService.createTransaction(transactionData);
      res.status(201).json(createdTransaction);
    } catch (error) {
      next(error);
    }
  };

  // Update transaction
  public updateTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionId = req.params.id;
      const transactionData = req.body;
      const updatedTransaction = await this.transactionService.updateTransaction(transactionId, transactionData);
      res.status(200).json(updatedTransaction);
    } catch (error) {
      next(error);
    }
  };

  // Delete transaction
  public deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionId = req.params.id;
      const result = await this.transactionService.deleteTransaction(transactionId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Get transaction summary for a fund
  public getTransactionSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundId = req.params.fundId;
      const summary = await this.transactionService.getTransactionSummary(fundId);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  // Get transactions by date range
  public getTransactionsByDateRange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundId = req.params.fundId;
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        res.status(400).json({ message: 'startDate and endDate are required' });
        return;
      }

      const transactions = await this.transactionService.getTransactionsByDateRange(
        fundId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  };
}