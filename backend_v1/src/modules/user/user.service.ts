import { PrismaClient, Role, Prisma } from "../../generated/prisma";
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

// Get all users with pagination and filtering (admin only)
export const getAllUsers = async (options: {
  skip?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}) => {
  try {
    const { skip = 0, limit = 10, search, sortBy = 'createdAt', order = 'desc' } = options;
    
    // Build the where condition based on search
    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { phoneNumber: { contains: search, mode: Prisma.QueryMode.insensitive } }
      ]
    } : {};

    // Count total records
    const total = await prisma.user.count({ where });
    
    // Get paginated and sorted data
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    });
    
    return {
      data: users,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

// Delete user by ID (admin only)
export const deleteUser = async (userId: string) => {
  try {
    return await prisma.user.delete({ where: { id: userId } });
  } catch (error) {
    throw error;
  }
};

// getting users by id not restricted to admin
// Get user by ID (not restricted to admin)
export const getUserById = async (userId: string) => {
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