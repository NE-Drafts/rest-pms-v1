import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

interface JwtPayload {
  userId: string;
  role: 'USER' | 'ADMIN';
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "6h";
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const signToken = (
  payload: JwtPayload,
  expiresIn: string | number = JWT_EXPIRES_IN
): string => {
    return jwt.sign(
      payload, 
      JWT_SECRET, 
      { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
