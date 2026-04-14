import express, { Request } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireRole } from "./middleware/auth";
import { login } from "./services/authService";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

app.post("/api/auth/login", async (req, res) => {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

app.get("/api/properties", requireAuth, async (req: AuthRequest, res) => {
  const properties = await prisma.property.findMany({
    include: { landlord: { select: { email: true } } },
  });
  res.json(properties);
});

app.post(
  "/api/properties",
  requireAuth,
  requireRole(["LANDLORD"]),
  async (req: AuthRequest, res) => {
    const { title, description, depositAmount } = req.body;
    if (!req.user) return res.status(401).json({ error: "No user" });
    const property = await prisma.property.create({
      data: {
        title,
        description,
        depositAmount,
        landlordId: req.user.id,
      },
      include: { landlord: true },
    });
    res.json(property);
  },
);

app.post("/api/escrows", requireAuth, async (req: AuthRequest, res) => {
  const { propertyId } = req.body;
  if (!req.user) return res.status(401).json({ error: "No user" });
  const escrow = await prisma.escrow.create({
    data: {
      propertyId,
      tenantId: req.user.id,
    },
    include: { property: true },
  });
  res.json(escrow);
});

// Listen removed - in server.ts

export default app;
