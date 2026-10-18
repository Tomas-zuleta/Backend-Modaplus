import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../errors';

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(options: ValidateOptions) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const errors: Record<string, string[]> = {};

      if (options.body) {
        const result = options.body.safeParse(req.body);
        if (!result.success) {
          for (const issue of result.error.issues) {
            const path = issue.path.join('.');
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
          }
        } else {
          req.body = result.data;
        }
      }

      if (options.query) {
        const result = options.query.safeParse(req.query);
        if (!result.success) {
          for (const issue of result.error.issues) {
            const path = `query.${issue.path.join('.')}`;
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
          }
        }
      }

      if (options.params) {
        const result = options.params.safeParse(req.params);
        if (!result.success) {
          for (const issue of result.error.issues) {
            const path = `params.${issue.path.join('.')}`;
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
          }
        } else {
          req.params = result.data;
        }
      }

      if (Object.keys(errors).length > 0) {
        throw new ValidationError(errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
