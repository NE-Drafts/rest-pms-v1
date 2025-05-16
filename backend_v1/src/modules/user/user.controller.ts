import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {     //I thik i have to handle these erros using the error middleware 
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);
    res.json({ token, user });
  } catch (err) {
    next(err);   //I thik i have to handle these erros using the error middleware 
  }
};

// Admin endpoints for user management
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
  