// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '../exceptions/http.exception';

// User interface
export interface AuthenticatedUser {
  id: string;
  _id: string;
  email: string;
  role: string;
  [key: string]: any;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser; // Required instead of optional
    }
  }
}

export const authMiddleware = (requiredRoles?: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // 1. Get token from header
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        throw new HttpException(401, 'Authentication token missing');
      }

      // 2. Verify token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new HttpException(500, 'JWT secret not configured');
      }

      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

      // 3. Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new HttpException(401, 'Token expired');
      }

      // 4. Create user object with required properties
      const user: AuthenticatedUser = {
        id: decoded.id as string,
        _id: decoded.id as string,
        email: decoded.email as string,
        role: decoded.role as string,
        ...decoded,
      };

      // 5. Attach user to request (required)
      req.user = user;

      // 6. Role-based authorization if required roles are specified
      if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(user.role)) {
          throw new HttpException(403, 'Insufficient permissions');
        }
      }

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new HttpException(401, 'Invalid token'));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new HttpException(401, 'Token expired'));
      } else {
        next(error);
      }
    }
  };
};

// Optional: Middleware to ensure user exists (extra safety)
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new HttpException(401, 'Authentication required');
  }
  next();
};