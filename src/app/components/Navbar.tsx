"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth"); // Redirige al login después del logout
  };

  return (
    <nav >   
      {/* 🔵 Menú de Usuario */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 bg-secondary px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <span>{user.displayName}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {/* 🔵 Menú Desplegable */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => router.push("/profile")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                📄 Mi Cuenta
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
