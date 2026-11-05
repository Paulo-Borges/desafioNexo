import React from "react";
import { Outlet } from "react-router-dom";
import DarkSidebar from "./DarkSidebar";

const AtendenteLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white antialiased">
      {/* Sidebar escura lateral compacta */}
      <DarkSidebar />

      {/* Conteúdo da aplicação (Área de Atendente) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AtendenteLayout;
