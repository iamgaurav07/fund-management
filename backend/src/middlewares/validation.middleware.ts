// middlewares/validation.middleware.ts
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/http.exception';

export function validationMiddleware<_T>(
  type: any,
  skipMissingProperties = false,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(type, req.body);
    validate(dtoObj, { skipMissingProperties, whitelist: true, forbidNonWhitelisted: true }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints || {}))
            .join(', ');
          next(new HttpException(400, message));
        } else {
          req.body = dtoObj;
          next();
        }
      },
    );
  };
}
