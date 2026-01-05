import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

const { login } = new AuthController();

router.post('/login', login);

export default router;
