import type { Metadata } from "next";
import QuizClient from "@/components/QuizClient";

export const metadata: Metadata = {
  title: "Quiz : Comment Next.js résout les limites du CSR",
  description:
    "30 questions sur le rendu serveur, le rendu statique et l’approche hybride de Next.js.",
  openGraph: {
    title: "Quiz : Comment Next.js résout les limites du CSR",
    description:
      "SSR/SSG, Server Components, Metadata, Dynamic Imports et Streaming.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function QuizPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">
        Quiz : Comment Next.js résout les limites du CSR
      </h1>
      <p>
        30 questions pour vérifier la compréhension du rendu serveur, du rendu
        statique et de l’approche hybride de Next.js.
      </p>
      <QuizClient />
    </main>
  );
}
