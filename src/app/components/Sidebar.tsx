"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Question {
  id: string;
  mensaje: string;
}

export default function Sidebar({ onSelectQuestion }: { onSelectQuestion: (mensaje: string) => void }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchQuestions = async () => {
      try {
        const userConsultasRef = collection(db, "usuarios", user.uid, "consultas");
        const q = query(userConsultasRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          mensaje: doc.data().mensaje,
        }));

        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error obteniendo el historial:", error);
      }
    };

    fetchQuestions();
  }, [user]);

  return (
    <>
      {/* Botón de abrir/cerrar que se mueve con el Sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-[4.5rem] left-${isOpen ? "64" : "0"} bg-primary text-white p-2 rounded-r-lg shadow-md transition-all duration-300 z-40`}
      >
        {isOpen ? "❮" : "❯"}
      </button>

      {/* Sidebar: Ahora inicia debajo del Navbar (top-16) y se ajusta sin superponerlo */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-800 text-white w-64 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } shadow-lg z-30`}
      >
        <h2 className="text-xl font-bold p-4 border-b border-gray-700">📜 Historial</h2>

        <div className="p-4 space-y-2 overflow-y-auto max-h-[80vh]">
          {questions.length === 0 ? (
            <p className="text-gray-400">No hay preguntas aún.</p>
          ) : (
            questions.map((question) => (
              <button
                key={question.id}
                onClick={() => onSelectQuestion(question.mensaje)}
                className="block w-full text-left bg-gray-700 hover:bg-gray-600 p-2 rounded transition"
              >
                {question.mensaje.length > 30 ? question.mensaje.substring(0, 30) + "..." : question.mensaje}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
