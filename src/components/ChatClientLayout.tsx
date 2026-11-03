import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
const ChatClientLayout = () => {
  const { pathname } = useLocation();
  const pagina = pathname === "/perfil" ? "perfil" : "chat";

  return (
    <div className="">
      <Sidebar />
      <Header pagina={pagina} />
      <main className="ml-60 pt-18 h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatClientLayout;
