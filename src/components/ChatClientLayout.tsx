import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
const ChatClientLayout = () => {
  return (
    <div>
      <Sidebar />
      <Header />
      <Outlet />
    </div>
  );
};

export default ChatClientLayout;
