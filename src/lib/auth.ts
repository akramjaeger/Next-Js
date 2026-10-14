import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type Role = "ADMIN" | "ENSEIGNANT" | "ETUDIANT";

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

type AuthSuccess = {
  ok: true;
  user: { id: number; name: string; email: string; role: Role };
};

type AuthFailure = {
  ok: false;
  response: NextResponse;
};

export async function requireRole(
  allowed: Role[]
): Promise<AuthSuccess | AuthFailure> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      ),
    };
  }

  if (!allowed.includes(user.role as Role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Accès interdit" }, { status: 403 }),
    };
  }

  return { ok: true, user: { ...user, role: user.role as Role } };
}
