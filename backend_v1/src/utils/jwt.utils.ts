import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

interface JwtPayload {
  userId: number;
  role: 'USER' | 'ADMIN';
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "6h" as string;
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const signToken = (
  payload: JwtPayload,
  expiresIn: string | number = "6h"
): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      });
};
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
