"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Chat() {
  const [mensaje, setMensaje] = useState("");
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string; token: string } | null>(null);
  const router = useRouter();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUser({ email: user.email!, token });
      } else {
        router.push("/login"); // Si no hay usuario, redirigir a login
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para enviar la consulta al backend Flask
  const enviarConsulta = async () => {
    if (!mensaje.trim()) return;
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/chat",
        { mensaje },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setRespuesta(response.data.respuesta);
    } catch (error) {
      console.error("Error en la consulta:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Chat Astrológico</h1>
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        className="border p-2 w-96"
        placeholder="Escribe tu pregunta..."
      />
      <button
        onClick={enviarConsulta}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
      >
        Enviar
      </button>
      {respuesta && (
        <div className="mt-4 border p-2 w-96">
          <p className="font-bold">Respuesta:</p>
          <p>{respuesta}</p>
        </div>
      )}
    </div>
  );
}
