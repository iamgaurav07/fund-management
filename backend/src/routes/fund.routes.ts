import { Router } from 'express';
import { FundController } from '../controllers/fund.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateFundDto, UpdateFundDto } from '../dtos/fund.dto';

const router = Router();
const fundController = new FundController();

// Get all funds
router.get('/', fundController.getFunds);

// Get funds with filters (optional)
router.get('/filter', fundController.getFundsWithFilters);

// Get fund by ID
router.get('/:id', fundController.getFundById);

// Create new fund
router.post('/', validationMiddleware(CreateFundDto), fundController.createFund);

// Update fund
router.put('/:id', validationMiddleware(UpdateFundDto, true), fundController.updateFund);

// Delete fund
router.delete('/:id', fundController.deleteFund);

export default router;