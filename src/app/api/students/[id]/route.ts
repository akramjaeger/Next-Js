import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, publicUserSelect } from "@/lib/auth";
import { updateStudentSchema } from "@/lib/validation";

// Règle ENSEIGNANT documentée : peut modifier uniquement le nom
// d'un utilisateur ETUDIANT. Ni l'email, ni le rôle, ni le mot de passe.
// ADMIN peut modifier nom et email. ETUDIANT ne peut rien modifier.

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(["ADMIN", "ENSEIGNANT"]);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const targetId = Number(id);
  if (!Number.isInteger(targetId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateStudentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  if (auth.user.role === "ENSEIGNANT") {
    if (target.role !== "ETUDIANT") {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }
    if (parsed.data.email !== undefined) {
      return NextResponse.json(
        { error: "Accès interdit : seul le nom est modifiable" },
        { status: 403 }
      );
    }
    if (parsed.data.name === undefined) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }
    const updated = await prisma.user.update({
      where: { id: targetId },
      data: { name: parsed.data.name },
      select: publicUserSelect,
    });
    return NextResponse.json(updated);
  }

  // ADMIN
  if (parsed.data.email && parsed.data.email !== target.email) {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }
  }
  const updated = await prisma.user.update({
    where: { id: targetId },
    data: {
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.email !== undefined ? { email: parsed.data.email } : {}),
    },
    select: publicUserSelect,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const targetId = Number(id);
  if (!Number.isInteger(targetId)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: targetId } });
  return NextResponse.json({ ok: true });
}
