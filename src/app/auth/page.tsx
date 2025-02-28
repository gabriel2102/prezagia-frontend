"use client"
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FormData {
  email: string;
  password: string;
  birthDate?: string;
  birthPlace?: string;
  birthTime?: string;
}

export default function Login() {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        console.log("Usuario registrado:", formData);
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log("Usuario autenticado:", formData.email);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario autenticado con Google:", user);

      // Verificar si el usuario ya tiene un perfil en Firestore
      const userDoc = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(userDoc);
      
      if (!docSnap.exists()) {
        // Si el usuario no tiene perfil, redirigirlo a completar su información
        await setDoc(userDoc, {
          email: user.email,
          birthDate: "",
          birthPlace: "",
          birthTime: "",
        });
        router.push("/profile-setup"); // Redirigir a la página de completar perfil
      } else {
        router.push("/chat"); // Redirigir a la página principal si ya tiene perfil
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          {isRegister ? "Registro" : "Iniciar Sesión"}
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Correo Electrónico
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
          </label>

          <label className="block">
            Contraseña
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
          </label>

          {isRegister && (
            <>
              <label className="block">
                Fecha de Nacimiento
                <input type="date" name="birthDate" value={formData.birthDate || ""} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
              </label>

              <label className="block">
                Lugar de Nacimiento
                <input type="text" name="birthPlace" value={formData.birthPlace || ""} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
              </label>

              <label className="block">
                Hora Aproximada de Nacimiento
                <input type="time" name="birthTime" value={formData.birthTime || ""} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
              </label>
            </>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <button onClick={handleGoogleLogin} className="w-full mt-4 bg-red-600 text-white p-2 rounded">
          Iniciar sesión con Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isRegister ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Inicia sesión aquí" : "Regístrate aquí"}
          </button>
        </p>
      </div>
    </div>
  );
}
