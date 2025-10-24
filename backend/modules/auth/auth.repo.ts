import { PrismaClient } from "@prisma/client";
import { User } from "./auth.schema";

const prisma = new PrismaClient();

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return (await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as User | null;
  }

  async findById(id: string): Promise<User | null> {
    return (await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as User | null;
  }

  async create(data: CreateUserData): Promise<User> {
    return (await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as User;
  }

  async update(
    id: string,
    data: Partial<Pick<User, "name" | "email" | "password" | "isVerified">>
  ): Promise<User> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = data.password;
    if (data.isVerified !== undefined) updateData.isVerified = data.isVerified;

    return (await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as User;
  }
}
