import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = loginSchema.extend({
  role: z.enum(["LANDLORD", "TENANT"]),
});

export const listPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  depositAmount: z.number().positive(),
});

export const payEscrowSchema = z.object({
  propertyId: z.string(),
});

export const confirmSchema = z.object({
  propertyId: z.string(),
});
