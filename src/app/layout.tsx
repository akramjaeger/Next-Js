import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TP Auth — Next.js, Prisma, Rôles et Quiz CSR",
  description:
    "Authentification full stack Next.js, gestion des rôles et quiz sur la résolution des limites du CSR.",
  openGraph: {
    title: "TP Auth — Next.js",
    description:
      "SSR, SSG, Server Components, Metadata, Dynamic Imports et Streaming.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TP Auth Next.js",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
