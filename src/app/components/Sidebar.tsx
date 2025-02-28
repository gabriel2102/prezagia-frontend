"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Question {
  id: string;
  mensaje: string;
}

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);

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
    <div className="flex">
      {/* 📌 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white w-64 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } shadow-lg z-40`}
      >
        {/* 📌 Título */}
        <h2 className="text-xl font-bold p-4 border-b border-gray-700">📜 Historial</h2>

        {/* 📌 Lista de Preguntas */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[80vh]">
          {questions.length === 0 ? (
            <p className="text-gray-400">No hay preguntas aún.</p>
          ) : (
            questions.map((question) => (
              <button
                key={question.id}
                //onClick={() => onSelectQuestion(question.mensaje)}
                className="block w-full text-left bg-gray-700 hover:bg-gray-600 p-2 rounded transition"
              >
                {question.mensaje.length > 30 ? question.mensaje.substring(0, 30) + "..." : question.mensaje}
              </button>
            ))
          )}
        </div>
      </div>

      {/* 📌 Botón de abrir/cerrar que se mueve con el Sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 transform -translate-y-1/2 left-${isOpen ? "64" : "0"} bg-primary text-white p-2 rounded-r-lg shadow-md transition-all duration-300 z-50`}
      >
        {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      </button>
    </div>
  );
}
