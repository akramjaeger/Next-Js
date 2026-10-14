import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../generated/prisma/client";

// CLI Prisma résout file:./dev.db depuis prisma/.
// Le runtime Next résout depuis la racine projet : on réconcilie ici
// sans changer la valeur du .env (file:./dev.db comme dans le TP).
function resolveDatabaseUrl(url: string | undefined): string | undefined {
  if (!url || !url.startsWith("file:")) return url;
  const p = url.slice("file:".length);
  if (/^([A-Za-z]:)?\//.test(p)) return url; // déjà absolu
  const rel = p.replace(/^\.\//, "");
  const fromRoot = path.join(process.cwd(), rel).replace(/\\/g, "/");
  if (fs.existsSync(path.join(process.cwd(), rel))) {
    return `file:${fromRoot}`;
  }
  const fromPrismaDir = path
    .join(process.cwd(), "prisma", path.basename(rel))
    .replace(/\\/g, "/");
  if (fs.existsSync(path.join(process.cwd(), "prisma", path.basename(rel)))) {
    return `file:${fromPrismaDir}`;
  }
  return `file:${fromRoot}`;
}

const g = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  g.prisma ??
  new PrismaClient({
    datasourceUrl: resolveDatabaseUrl(process.env.DATABASE_URL),
  });

if (process.env.NODE_ENV !== "production") {
  g.prisma = prisma;
}
