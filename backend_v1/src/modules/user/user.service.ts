import { PrismaClient, Role } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../utils/jwt.utils";

const prisma = new PrismaClient();

// Register a new user
export const registerUser = async (data: {
  email: string;
  password: string;
  role: Role;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phoneNumber: data.phoneNumber,
      },
    });
  } catch (error) {
    throw error;
  }
};

// Login user and return token
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user };
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

// Delete user by ID (admin only)
export const deleteUser = async (userId: number) => {
  try {
    return await prisma.user.delete({ where: { id: userId } });
  } catch (error) {
    throw error;
  }
};



// getting users by id not restricted to admin
 // Get user by ID (not restricted to admin)
export const getUserById = async (userId: number) => {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  };
  
  // Get users by name (not restricted to admin)
  export const getUsersByName = async (name: string) => {
    try {
      return await prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: name, mode: 'insensitive' } },
            { lastName: { contains: name, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  };