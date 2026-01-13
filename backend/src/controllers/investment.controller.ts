import { Request, Response, NextFunction } from 'express';
import { InvestmentService } from '../services/investment.service';

export class InvestmentController {
  private investmentService = new InvestmentService();

  // Get all investments
  public getInvestments = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const investments = await this.investmentService.findAllInvestments();
      res.status(200).json(investments);
    } catch (error) {
      next(error);
    }
  };

  // Get investments by fund ID
  public getInvestmentsByFundId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundId = req.params.fundId;
      const investments = await this.investmentService.findInvestmentsByFundId(fundId);
      res.status(200).json(investments);
    } catch (error) {
      next(error);
    }
  };

  // Get investment by ID
  public getInvestmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const investmentId = req.params.id;
      const investment = await this.investmentService.findInvestmentById(investmentId);
      res.status(200).json(investment);
    } catch (error) {
      next(error);
    }
  };

  // Create new investment
  public createInvestment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const investmentData = req.body;
      const createdInvestment = await this.investmentService.createInvestment(investmentData);
      res.status(201).json(createdInvestment);
    } catch (error) {
      next(error);
    }
  };

  // Update investment
  public updateInvestment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const investmentId = req.params.id;
      const investmentData = req.body;
      const updatedInvestment = await this.investmentService.updateInvestment(investmentId, investmentData);
      res.status(200).json(updatedInvestment);
    } catch (error) {
      next(error);
    }
  };

  // Delete investment
  public deleteInvestment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const investmentId = req.params.id;
      const result = await this.investmentService.deleteInvestment(investmentId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Get investment performance
  public getInvestmentPerformance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const investmentId = req.params.id;
      const performance = await this.investmentService.getInvestmentPerformance(investmentId);
      res.status(200).json(performance);
    } catch (error) {
      next(error);
    }
  };

  // Get fund investment summary
  public getFundInvestmentSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundId = req.params.fundId;
      const summary = await this.investmentService.getFundInvestmentSummary(fundId);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  };

  // Search investments
  public searchInvestments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { q, fundId, status, currency } = req.query;
      const investments = await this.investmentService.searchInvestments(q as string, {
        fundId: fundId as string,
        status: status as string,
        currency: currency as string,
      });
      res.status(200).json(investments);
    } catch (error) {
      next(error);
    }
  };

  // Get investments with filters
  public getInvestmentsWithFilters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        fundId: req.query.fundId as string,
        status: req.query.status as string,
        currency: req.query.currency as string,
        minInvestedAmount: req.query.minInvestedAmount ? Number(req.query.minInvestedAmount) : undefined,
        maxInvestedAmount: req.query.maxInvestedAmount ? Number(req.query.maxInvestedAmount) : undefined,
        minCurrentValue: req.query.minCurrentValue ? Number(req.query.minCurrentValue) : undefined,
        maxCurrentValue: req.query.maxCurrentValue ? Number(req.query.maxCurrentValue) : undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      };

      const investments = await this.investmentService.getInvestmentsWithFilters(filters);
      res.status(200).json(investments);
    } catch (error) {
      next(error);
    }
  };
}