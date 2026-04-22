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

app.get("/api/escrows", requireAuth, async (req: AuthRequest, res) => {
  const escrows = await prisma.escrow.findMany({
    where: {
      OR: [
        { tenantId: req.user?.id },
        { property: { landlordId: req.user?.id } },
      ],
    },
    include: {
      property: {
        include: { landlord: { select: { email: true } } },
      },
      tenant: { select: { email: true } },
    },
  });
  res.json(escrows);
});

app.patch(
  "/api/escrows/:id/confirm",
  requireAuth,
  async (req: AuthRequest, res) => {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: "No user" });

    // Get current state
    const currentEscrow = await prisma.escrow.findUnique({
      where: { id },
      select: {
        landlordConfirmed: true,
        tenantConfirmed: true,
      },
    });

    if (!currentEscrow)
      return res.status(404).json({ error: "Escrow not found" });

    const updateData: any = {};

    if (req.user.role === "LANDLORD") {
      updateData.landlordConfirmed = true;
      updateData.status = currentEscrow.tenantConfirmed
        ? "READY_TO_RELEASE"
        : "LANDLORD_CONFIRMED";
    } else if (req.user.role === "TENANT") {
      updateData.tenantConfirmed = true;
      updateData.status = currentEscrow.landlordConfirmed
        ? "READY_TO_RELEASE"
        : "TENANT_CONFIRMED";
    }

    const escrow = await prisma.escrow.update({
      where: { id },
      data: updateData,
      include: { property: true },
    });

    res.json(escrow);
  },
);

app.patch(
  "/api/escrows/:id/release",
  requireAuth,
  requireRole(["LANDLORD"]),
  async (req: AuthRequest, res) => {
    const { id } = req.params;
    const escrow = await prisma.escrow.update({
      where: { id },
      data: {
        status: "RELEASED",
        released: true,
      },
      include: { property: true },
    });
    res.json(escrow);
  },
);

// Listen removed - in server.ts

export default app;
