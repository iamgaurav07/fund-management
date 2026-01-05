import { Router } from 'express';
import authRoute from './auth.route';
import healthRoute from './health.route';
import userRoute from './user.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/healthz', healthRoute);
router.use('/users', userRoute);

export default router;