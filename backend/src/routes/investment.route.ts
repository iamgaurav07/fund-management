import { Router } from 'express';
import { InvestmentController } from '../controllers/investment.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateInvestmentDto, UpdateInvestmentDto } from '../dtos/investment.dto';

const router = Router();
const investmentController = new InvestmentController();

// Get all investments
router.get('/', investmentController.getInvestments);

// Search investments
router.get('/search', investmentController.searchInvestments);

// Get investments with filters
router.get('/filter', investmentController.getInvestmentsWithFilters);

// Get investments by fund ID
router.get('/fund/:fundId', investmentController.getInvestmentsByFundId);

// Get fund investment summary
router.get('/fund/:fundId/summary', investmentController.getFundInvestmentSummary);

// Get investment by ID
router.get('/:id', investmentController.getInvestmentById);

// Get investment performance
router.get('/:id/performance', investmentController.getInvestmentPerformance);

// Create new investment
router.post('/', validationMiddleware(CreateInvestmentDto), investmentController.createInvestment);

// Update investment
router.put('/:id', validationMiddleware(UpdateInvestmentDto, true), investmentController.updateInvestment);

// Delete investment
router.delete('/:id', investmentController.deleteInvestment);

export default router;