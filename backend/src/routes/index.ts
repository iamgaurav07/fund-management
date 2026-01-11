import { Router } from 'express';
import authRoute from './auth.route';
import healthRoute from './health.route';
import userRoute from './user.route';
import fundRoutes from './fund.routes';
import transactionRoutes from './transaction.routes';

const router = Router();

router.use('/auth', authRoute);
router.use('/healthz', healthRoute);
router.use('/users', userRoute);
router.use('/funds', fundRoutes);
router.use('/transactions', transactionRoutes);

export default router;