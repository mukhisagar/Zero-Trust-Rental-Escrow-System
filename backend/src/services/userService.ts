import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { login } from './authService';
import { createUserSchema } from '../utils/validation';

const prisma = new PrismaClient();

export async function createUser(email: string, password: string, roleId: string) {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, passwordHash: hashed, roleId },
    include: { role: true },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
}

export const authLogin = login; // Re-export

export function requireUserId(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}
