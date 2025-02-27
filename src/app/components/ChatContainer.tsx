"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAuth } from "@/context/AuthContext";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatContainer({ selectedQuestion }: { selectedQuestion: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [mensaje, setMensaje] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 📌 Efecto para enviar automáticamente la pregunta seleccionada desde el historial
  useEffect(() => {
    if (selectedQuestion) {
      enviarMensaje(selectedQuestion);
    }
  }, [selectedQuestion]);

  // 📌 Función para enviar mensaje y recibir respuesta
  const enviarMensaje = async (mensajeTexto: string = mensaje) => {
    if (!mensajeTexto.trim()) return;

    setMessages((prev) => [...prev, { text: mensajeTexto, sender: "user" }]);
    setMensaje("");

    // 🔥 Animación de entrada del mensaje del usuario
    setTimeout(() => {
      if (chatContainerRef.current) {
        gsap.to(chatContainerRef.current, {
          scrollTop: chatContainerRef.current.scrollHeight,
          duration: 1.2,
          ease: "power2.out",
        });
      }
    }, 100);

    try {
      const token = await user?.getIdToken();
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensaje: mensajeTexto }),
      });

      const data = await response.json();
      mostrarRespuestaConAnimacion(data.respuesta);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Error al obtener respuesta.", sender: "bot" }]);
    }
  };

  // 📌 Función para animar la respuesta del bot
  const mostrarRespuestaConAnimacion = (respuesta: string) => {
    let index = 0;
    let displayedText = "";

    const escribir = () => {
      if (index < respuesta.length) {
        displayedText += respuesta[index];
        setMessages((prev) => [...prev.slice(0, -1), { text: displayedText, sender: "bot" }]);
        index++;

        // 📌 Scroll automático con GSAP en cada actualización
        setTimeout(() => {
          if (chatContainerRef.current) {
            gsap.to(chatContainerRef.current, {
              scrollTop: chatContainerRef.current.scrollHeight,
              duration: 0.8,
              ease: "power2.out",
            });
          }
        }, 20);

        setTimeout(escribir, 10);
      }
    };

    setMessages((prev) => [...prev, { text: "", sender: "bot" }]);
    escribir();
  };

  return (
    <>
        <div className="flex flex-col h-screen w-3/5 mx-auto">
            {/* 📌 Contenedor del Chat */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-hidden p-4 bg-white">
                {messages.map((msg, index) => (
                <div key={index} className={`w-full py-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {/* 📌 Si es usuario, mantiene el globo */}
                    {msg.sender === "user" ? (
                    <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
                        {msg.text}
                    </div>
                    ) : (
                    // 📌 Si es bot, ocupa todo el ancho sin globo
                    <div className="w-full text-gray-900 p-2">{msg.text}</div>
                    )}
                </div>
                ))}
            </div>        
        </div>
        {/* 📌 Área de Entrada de Mensajes */}
        <div className="sticky bottom-0 p-4 bg-gray-200 flex items-center h-16 w-3/5 mx-auto">
            <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && enviarMensaje()}
            />
            <button
            onClick={() => enviarMensaje()}
            className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
            🚀 Enviar
            </button>
        </div>
    
    </>
  );
}
