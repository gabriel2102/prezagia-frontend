import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prezagia - Astrología",
  description: "Consulta astrológica basada en IA y datos astronómicos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
