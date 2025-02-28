"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { User, onAuthStateChanged } from "firebase/auth";

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    birthDate: "",
    birthPlace: "",
    birthTime: ""
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);


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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const user: User | null = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");
      
      const userDoc = doc(db, "usuarios", user.uid);
      await updateDoc(userDoc, formData);
      
      router.push("/chat"); // Redirigir a la página principal
    } catch (err: any) {
      setError(err.message);
    }
  };
  if (loading) return <p className="text-center mt-4">Cargando...</p>;


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Completa tu Perfil</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Fecha de Nacimiento
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
          </label>

          <label className="block">
            Lugar de Nacimiento
            <input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
          </label>

          <label className="block">
            Hora Aproximada de Nacimiento
            <input type="time" name="birthTime" value={formData.birthTime} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
          </label>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Guardar</button>
        </form>
      </div>
    </div>
  );
}
