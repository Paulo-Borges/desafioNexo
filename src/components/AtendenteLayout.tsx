import { Outlet } from "react-router-dom";
import HeaderAtendimento from "./HeaderAtendimento";
const AtendenteLayout = () => {
  return (
    <div>
      <HeaderAtendimento />
      <Outlet />
    </div>
  );
};

export default AtendenteLayout;
