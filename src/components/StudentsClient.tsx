"use client";
import { useEffect, useState } from "react";

type Student = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function StudentsClient({ role }: { role: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setError("");
    const res = await fetch("/api/students");
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(
        res.status === 401
          ? "401 : connectez-vous pour voir cette ressource."
          : res.status === 403
            ? "403 : votre rôle ne permet pas cette action."
            : (j.error ?? "Une erreur est survenue")
      );
      setStudents([]);
      return;
    }
    setStudents(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(
        res.status === 403
          ? "403 : création réservée à ADMIN."
          : (j.error ?? "Une erreur est survenue")
      );
      return;
    }
    (e.target as HTMLFormElement).reset();
    setMessage("Étudiant créé.");
    load();
  }

  async function onRename(id: number, name: string) {
    setError("");
    setMessage("");
    const res = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(
        res.status === 403
          ? "403 : modification non autorisée pour votre rôle."
          : (j.error ?? "Une erreur est survenue")
      );
      return;
    }
    setMessage("Étudiant modifié.");
    load();
  }

  async function onDelete(id: number) {
    setError("");
    setMessage("");
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(
        res.status === 403
          ? "403 : suppression réservée à ADMIN."
          : (j.error ?? "Une erreur est survenue")
      );
      return;
    }
    setMessage("Étudiant supprimé.");
    load();
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-700">{message}</p>}

      {role === "ADMIN" && (
        <form onSubmit={onCreate} className="flex max-w-lg flex-col gap-2">
          <h2 className="font-bold">Créer un étudiant (ADMIN)</h2>
          <input name="name" placeholder="Nom" required className="rounded border p-2" />
          <input name="email" type="email" placeholder="Email" required className="rounded border p-2" />
          <input name="password" type="password" placeholder="Mot de passe" required className="rounded border p-2" />
          <button className="rounded bg-gray-800 px-3 py-2 text-white">Créer</button>
        </form>
      )}

      <div>
        <h2 className="font-bold">Liste des étudiants</h2>
        {students.length === 0 ? (
          <p>Aucune donnée.</p>
        ) : (
          <ul className="space-y-2">
            {students.map((s) => (
              <li key={s.id} className="rounded border p-2">
                <p>
                  {s.name} — {s.email}
                </p>
                {(role === "ADMIN" || role === "ENSEIGNANT") && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const name = new FormData(e.currentTarget).get("name") as string;
                      onRename(s.id, name);
                    }}
                    className="mt-2 flex gap-2"
                  >
                    <input name="name" defaultValue={s.name} required className="rounded border p-1" />
                    <button className="rounded bg-gray-200 px-2 py-1">Modifier</button>
                    {role === "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => onDelete(s.id)}
                        className="rounded bg-red-600 px-2 py-1 text-white"
                      >
                        Supprimer
                      </button>
                    )}
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
