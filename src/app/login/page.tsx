"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loginWithGoogle, logout } = useAuth();
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/chat"); // 🔥 Redirige automáticamente al chat si está logueado
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-dark to-primary">
      <div ref={containerRef} className="bg-white shadow-lg rounded-xl p-6 text-center w-96">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
        <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>

        {user ? (
          <div className="mt-4">
            <p className="text-lg font-medium">Hola, {user.displayName}</p>
            <button onClick={logout} className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300">
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button onClick={loginWithGoogle} className="mt-6 w-full bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300">
            Iniciar con Google
          </button>
        )}
      </div>
    </div>
  );
}
