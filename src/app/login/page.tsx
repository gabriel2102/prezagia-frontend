"use client";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // 🔥 Verifica si ya hay un usuario autenticado y redirige automáticamente
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        router.push("/chat");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // 🔥 Verifica si la autenticación con Redirect fue exitosa
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const token = await result.user.getIdToken();
          localStorage.setItem("token", token);
          router.push("/chat");
        }
      })
      .catch((error) => {
        console.error("Error en autenticación con redirect:", error);
      });
  }, []);

  // Función para iniciar sesión con Google usando Redirect
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider); // 🔥 Redirigir en lugar de usar una ventana emergente
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <button
        onClick={loginWithGoogle}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
}
