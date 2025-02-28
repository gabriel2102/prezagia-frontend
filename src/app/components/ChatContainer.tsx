"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAuth } from "@/context/AuthContext";
import { FiArrowUp } from "react-icons/fi"; // 🔥 Flecha para enviar
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";

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
      <div className="flex flex-col h-screen w-1/2 mx-auto">
        {/* 📌 Contenedor del Chat */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-6">
            <h2 className="text-2xl font-semibold text-gray-700">¿Qué deseas consultar hoy? 🔮</h2>
            
            <div className="flex gap-4">
              <button onClick={() => enviarMensaje("Consulta de Carta Astral")} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition shadow">
                🔮 Carta Astral
              </button>
              <button onClick={() => enviarMensaje("Consulta de Compatibilidades")} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition shadow">
                ❤️ Compatibilidades
              </button>
              <button onClick={() => enviarMensaje("Mi Horóscopo Hoy")} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition shadow">
                🌟 Mi Horóscopo Hoy
              </button>
            </div>

            {/* 📌 Input centrado cuando no hay mensajes */}
            <div className="relative w-[770px]">
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu consulta..."
                className="w-full h-[120px] border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-14 resize-none overflow-hidden align-top"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviarMensaje()}
              />
              <button
                onClick={() => enviarMensaje()}
                disabled={!mensaje.trim()} // 🔥 Desactiva si la caja está vacía
                className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiArrowUp className="h-6 w-6" />
              </button>
            </div>
          </div>
        ) : (
          // 📌 Chat normal cuando hay mensajes
          <div ref={chatContainerRef} className="flex-1 overflow-y-hidden p-4 bg-white">
            {messages.map((msg, index) => (
              <div key={index} className={`w-full py-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                {msg.sender === "user" ? (
                  <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
                    {msg.text}
                  </div>
                ) : (
                  <div className="w-full text-gray-900 p-2">{msg.text}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📌 Área de Entrada de Mensajes (solo cuando hay mensajes) */}
      {messages.length > 0 && (
        <div className="sticky bottom-0 p-4 bg-gray-200 flex items-center justify-center w-3/5 mx-auto">
          <div className="relative w-[770px]">
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="w-full h-[120px] border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-14 resize-none overflow-hidden align-top"
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviarMensaje()}
            />
            <button
              onClick={() => enviarMensaje()}
              disabled={!mensaje.trim()} // 🔥 Desactiva si la caja está vacía
              className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FiArrowUp className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      
    </>
  );
}
