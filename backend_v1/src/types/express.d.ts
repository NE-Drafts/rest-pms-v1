// src/types/express/index.d.ts
import { User } from "../../generated/prisma"; // Adjust the import path as needed

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number | string;
        role: Role;
      };
    }
  }
}
