import { Request, Response, NextFunction } from 'express';
import { FundService } from '../services/fund.service';
import { CreateFundDto, UpdateFundDto } from '../dtos/fund.dto';
import { validate } from 'class-validator';

export class FundController {
  private fundService = new FundService();

  // Get all funds
  public getFunds = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const funds = await this.fundService.findAllFunds();
      res.status(200).json(funds);
    } catch (error) {
      next(error);
    }
  };

  // Get fund by ID
  public getFundById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundId = req.params.id;
      const fund = await this.fundService.findFundById(fundId);
      res.status(200).json(fund);
    } catch (error) {
      next(error);
    }
  };

  // Create new fund
  public createFund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundData: CreateFundDto = req.body;
      
      // Validate DTO
      const createFundDto = new CreateFundDto();
      Object.assign(createFundDto, fundData);
      
      const errors = await validate(createFundDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
        res.status(400).json({ message: 'Validation failed', errors: errorMessages });
        return; // Just return void, no need to return the response
      }

      const createdFund = await this.fundService.createFund(fundData);
      res.status(201).json(createdFund);
    } catch (error) {
      next(error);
    }
  };

  // Update fund
  public updateFund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundId = req.params.id;
      const fundData: UpdateFundDto = req.body;
      
      // Validate DTO if data is provided
      if (Object.keys(fundData).length > 0) {
        const updateFundDto = new UpdateFundDto();
        Object.assign(updateFundDto, fundData);
        
        const errors = await validate(updateFundDto);
        if (errors.length > 0) {
          const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
          res.status(400).json({ message: 'Validation failed', errors: errorMessages });
          return; // Just return void
        }
      }

      const updatedFund = await this.fundService.updateFund(fundId, fundData);
      res.status(200).json(updatedFund);
    } catch (error) {
      next(error);
    }
  };

  // Delete fund
  public deleteFund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fundId = req.params.id;
      const result = await this.fundService.deleteFund(fundId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Get funds with filters (optional endpoint)
  public getFundsWithFilters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        status: req.query.status ? Number(req.query.status) : undefined,
        currency: req.query.currency as string,
        minFundSize: req.query.minFundSize ? Number(req.query.minFundSize) : undefined,
        maxFundSize: req.query.maxFundSize ? Number(req.query.maxFundSize) : undefined,
        vintageYear: req.query.vintageYear ? Number(req.query.vintageYear) : undefined,
      };

      const funds = await this.fundService.findFundsWithFilters(filters);
      res.status(200).json(funds);
    } catch (error) {
      next(error);
    }
  };
}