import React from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi"; // 🔥 Icono de menú para abrir el sidebar

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 bg-primary z-50 w-full">
      <div className="flex justify-between items-center p-4 text-black">
        {/* 📌 Título de la App */}
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          🌟 Prezagia
        </h1>

        {/* 📌 Botón de menú (solo en móviles) */}
        <button onClick={toggleSidebar} className="md:hidden text-black">
          <FiMenu className="h-8 w-8" />
        </button>

        {/* 📌 Navbar (se muestra en desktop) */}
        <div className="hidden md:block">
          <Navbar />
        </div>
      </div>
    </header>
  );
};

export default Header;
