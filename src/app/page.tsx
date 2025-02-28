"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Prezagia</h1>
      <p className="mb-4">Descubre tu destino con la astrología y la IA.</p>
      <button
        onClick={() => router.push("/auth")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Iniciar Sesión
      </button>
    </div>
  );
}
