import { PrismaClient, Role } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../utils/jwt.utils";

const prisma = new PrismaClient();

export const registerUser = async (data: {
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    //   role: data.role,  // in case we need it 
      
    },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user };
};
