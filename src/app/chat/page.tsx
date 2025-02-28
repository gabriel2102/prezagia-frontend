"use client";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";


export default function ChatPage() {

  const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
  
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            router.push("/auth"); // Redirigir a la página de autenticación si no está autenticado
          } else {
            setLoading(false);
          }
        });
        return () => unsubscribe();
      }, [router]);
      if (loading) return <p className="text-center mt-4">Cargando...</p>;


//770x120
  return (
    <div>
      {/* Sidebar */}

      {/* Contenedor Principal del Chat */}
      <ChatContainer selectedQuestion={mensaje} />
    </div>
  );
}
