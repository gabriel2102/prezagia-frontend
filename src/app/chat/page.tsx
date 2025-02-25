"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Lenis from "lenis";
import gsap from "gsap";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    lenis.current = new Lenis({
      duration: 1.2,
      lerp: 0.1,
      wheelMultiplier: 0.6, // 🔥 Reducir sensibilidad del mouse
      touchMultiplier: 1.3,
      infinite: false,
    });
  
    function raf(time: number) {
      lenis.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  
    return () => lenis.current?.destroy();
  }, []);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    setMessages((prev) => [...prev, { text: mensaje, sender: "user" }]);
    setMensaje("");

    // 🔥 Efecto de rebote en el mensaje del usuario
    setTimeout(() => {
      gsap.fromTo(
        ".message:last-child",
        { scale: 0.8 },
        { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" }
      );
    }, 100);

    // 🔥 Scroll automático después de enviar el mensaje
    setTimeout(() => {
      if (chatContainerRef.current) {
        lenis.current?.scrollTo(chatContainerRef.current.scrollHeight, {
          duration: 1.2,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      }
    }, 100);

    setIsTyping(true);

    try {
      const token = await user?.getIdToken();
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensaje }),
      });

      const data = await response.json();
      mostrarRespuestaConAnimacion(data.respuesta);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setMessages((prev) => [...prev, { text: "Error al obtener respuesta.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const mostrarRespuestaConAnimacion = (respuesta: string) => {
    let index = 0;
    let displayedText = "";
  
    const escribir = () => {
      if (index < respuesta.length) {
        displayedText += respuesta[index];
        setMessages((prev) => [...prev.slice(0, -1), { text: displayedText, sender: "bot" }]);
        index++;
  
        setTimeout(() => {
          if (chatContainerRef.current) {
            gsap.to(chatContainerRef.current, {
              scrollTop: chatContainerRef.current.scrollHeight,
              duration: 1.2, // 🔥 Duración más larga para un scroll progresivo
              ease: "power2.out", // 🌀 Efecto de inercia para suavizar
            });
          }
        }, 50); // 🔥 Espera un poco antes de hacer scroll
  
        setTimeout(escribir, 40);
      } else {
        animarMensaje();
      }
    };
  
    setMessages((prev) => [...prev, { text: "", sender: "bot" }]);
    escribir();
  };

  const animarMensaje = () => {
    gsap.fromTo(
      ".message",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar onSelectQuestion={(selectedMensaje) => setMensaje(selectedMensaje)} />

      {/* Contenedor Principal del Chat */}
      <div className="flex flex-col flex-1 h-full bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-primary mb-4 text-center">Chat Astrológico</h1>

        {/* Área de Mensajes */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-inner space-y-6"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message max-w-xs px-4 py-2 rounded-lg shadow transition-all ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white self-end ml-auto transform hover:scale-105"
                  : "bg-gray-300 text-black self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {/* Estado de "Escribiendo..." */}
          {isTyping && (
            <div className="self-start bg-gray-300 text-black px-4 py-2 rounded-lg shadow animate-pulse">
              ✍️ Escribiendo...
            </div>
          )}
        </div>

        {/* Área de Entrada de Texto */}
        <div className="flex items-center p-4 bg-white rounded-lg shadow-md mt-2">
          <input
            type="text"
            placeholder="Escribe tu pregunta..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          <button
            onClick={enviarMensaje}
            className="ml-4 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            🚀 Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
