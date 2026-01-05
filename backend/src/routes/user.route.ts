import { UserController } from '../controllers/user.controller';
import { Router } from 'express';

const router = Router();

const { createUser } = new UserController();

router.post('/', createUser);

export default router;
