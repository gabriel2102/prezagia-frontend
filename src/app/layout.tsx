"use client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { metadata } from "./metadata";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";


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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="es">
      <body className="h-screen flex bg-white text-gray-900 overflow-y-hidden">
        <AuthProvider>
          
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}>
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
