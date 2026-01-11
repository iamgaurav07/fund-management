import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateTransactionDto, UpdateTransactionDto } from '../dtos/transaction.dto';

const router = Router();
const transactionController = new TransactionController();

// Get all transactions
router.get('/', transactionController.getTransactions);

// Get transactions by fund ID
router.get('/fund/:fundId', transactionController.getTransactionsByFundId);

// Get transaction summary for a fund
router.get('/fund/:fundId/summary', transactionController.getTransactionSummary);

// Get transactions by date range
router.get('/fund/:fundId/date-range', transactionController.getTransactionsByDateRange);

// Get transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Create new transaction
router.post('/', validationMiddleware(CreateTransactionDto), transactionController.createTransaction);

// Update transaction
router.put('/:id', validationMiddleware(UpdateTransactionDto, true), transactionController.updateTransaction);

// Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

export default router;