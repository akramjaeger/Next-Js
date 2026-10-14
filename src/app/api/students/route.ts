import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole, publicUserSelect } from "@/lib/auth";
import { createStudentSchema } from "@/lib/validation";

// GET /api/students : ADMIN et ENSEIGNANT voient les étudiants,
// ETUDIANT voit uniquement ses propres données.
export async function GET() {
  const auth = await requireRole(["ADMIN", "ENSEIGNANT", "ETUDIANT"]);
  if (!auth.ok) return auth.response;

  if (auth.user.role === "ETUDIANT") {
    const me = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: publicUserSelect,
    });
    return NextResponse.json(me ? [me] : []);
  }

  const students = await prisma.user.findMany({
    where: { role: "ETUDIANT" },
    select: publicUserSelect,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(students);
}

// POST /api/students : création réservée à ADMIN.
export async function POST(req: Request) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = createStudentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Cet email est déjà utilisé" },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(parsed.data.password, 10);
  const student = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hash,
      role: "ETUDIANT",
    },
    select: publicUserSelect,
  });
  return NextResponse.json(student, { status: 201 });
}
