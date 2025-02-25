"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "./components/Navbar";
import { metadata } from "./metadata";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // 🔥 Ajusta la duración del scroll
      lerp: 0.1, // 🎭 Hace el scroll más suave (0.1 = más suave, 1 = instantáneo)
      wheelMultiplier: 1, // 📜 Ajusta la velocidad del scroll con el mouse
      touchMultiplier: 2, // 📱 Ajusta la velocidad del scroll en dispositivos táctiles
      infinite: false, // ❌ Desactiva scroll infinito
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy(); // Limpia Lenis al desmontar
  }, []);

  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
