import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService = new UserService();

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const createdUser = await this.userService.createUser(userData);

      res.status(201).json(createdUser);
    } catch (error) {
      next(error);
    }
  };
}
