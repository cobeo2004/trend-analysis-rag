import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const libsqlClient = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
});

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { libsqlClient };
