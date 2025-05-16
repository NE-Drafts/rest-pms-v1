import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library';
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        message: `A user with that ${err.meta?.target} already exists.`,
      });
    }
  }

  return res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
};