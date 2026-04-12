import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "fallback";
export const PORT = parseInt(process.env.PORT || "4000", 10);
export const DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";
