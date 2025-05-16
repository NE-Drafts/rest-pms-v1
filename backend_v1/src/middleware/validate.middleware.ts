import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schema.shape.body) {
      // If the schema includes a 'body' field, validate according to that structure
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
    } else {
      // Otherwise, validate the body directly
      schema.parse(req.body);
    }
    next();
  } catch (error: any) {
    return res.status(400).json({ message: "Validation Error", errors: error.errors });
  }
};
