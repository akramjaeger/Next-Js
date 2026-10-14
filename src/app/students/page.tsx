import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import StudentsClient from "@/components/StudentsClient";

export default async function StudentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, name: true },
  });
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">
        Gestion des étudiants — {user.role}
      </h1>
      <p>
        Connecté : {user.name} ({user.role})
      </p>
      <StudentsClient role={user.role} />
    </main>
  );
}
