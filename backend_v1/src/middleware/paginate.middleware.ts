import { Request, Response, NextFunction } from 'express';

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const paginateMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const { page = '1', limit = '10', search, sortBy, order = 'asc' } = req.query as PaginationQuery;
  
  const pageNumber = Math.max(parseInt(page) || 1, 1); // Minimum page 1
  const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 100); // Between 1 and 100
  const skip = (pageNumber - 1) * limitNumber;
  
  (req as any).pagination = {
    page: pageNumber,
    limit: limitNumber,
    skip,
    search: typeof search === 'string' ? search : undefined,
    sortBy: typeof sortBy === 'string' ? sortBy : undefined,
    order: order === 'desc' ? 'desc' : 'asc'
  };
  
  next();
}; 