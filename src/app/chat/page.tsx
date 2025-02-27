"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";


export default function ChatPage() {

  const [mensaje, setMensaje] = useState("");

//770x120
  return (
    <div>
      {/* Sidebar */}

      {/* Contenedor Principal del Chat */}
      <ChatContainer selectedQuestion={mensaje} />
    </div>
  );
}
