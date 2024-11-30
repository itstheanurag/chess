import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const GlobalRequestValidator = (schemas: { body?: any; params?: any; query?: any }) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      
      if (schemas.body) {
        schemas.body.parse(req.body);
      }
      if (schemas.params) {
        schemas.params.parse(req.params);
      }
      if (schemas.query) {
        schemas.query.parse(req.query);
      }

      // If all validations pass, move to the next middleware
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Handle validation errors
        res.status(400).json({
          errors: err.errors.map((e) => ({
            message: e.message,
            path: e.path.join('.'),
          })),
        });
      }
      // Handle any unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
