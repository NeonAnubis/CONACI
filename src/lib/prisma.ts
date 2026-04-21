import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);
      const isConnectionError =
        message.includes("Can't reach database server") ||
        message.includes("Connection refused") ||
        message.includes("ECONNRESET");

      if (isConnectionError && attempt < retries) {
        console.warn(
          `DB connection failed (attempt ${attempt}/${retries}), retrying in ${delay}ms...`
        );
        await new Promise((r) => setTimeout(r, delay));
        try {
          await prisma.$disconnect();
        } catch {
          // ignore disconnect errors
        }
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries reached");
}
