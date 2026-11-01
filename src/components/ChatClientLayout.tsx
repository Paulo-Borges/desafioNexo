import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
const ChatClientLayout = () => {
  return (
    <div className="">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-18 h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatClientLayout;
