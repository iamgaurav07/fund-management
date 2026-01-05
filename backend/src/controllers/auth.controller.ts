import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {

    private authService = new AuthService();

    public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const result = await this.authService.login(userData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}