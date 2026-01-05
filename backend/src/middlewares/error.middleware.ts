import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { HttpException } from '../exceptions/http.exception';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    error: {
      code: 404,
      description: 'The requested resource was not found on this server',
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
};

export const errorHandler = (
  err: Error | HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err instanceof HttpException) {
    statusCode = err.status;
  }

  if (process.env.NODE_ENV !== 'PRODUCTION') {
    logger.error(err.stack);
  } else {
    logger.error(message);
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'PRODUCTION' ? '🥞' : err.stack,
  });
};