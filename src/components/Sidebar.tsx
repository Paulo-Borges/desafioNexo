import NexoLogo from "../assets/nexoLogo.png";
import Atendimento from "../assets/atendimento.png";
import Perfil from "../assets/perfil.png";
import As from "../assets/As.png";
import Sair from "../assets/sair.png";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <section className="bg-white fixed left-0 h-full z-50 flex flex-col p-4 space-y-6 border border-l-mist-200 ">
      <div>
        <img src={NexoLogo} alt="" />
      </div>
      <Link
        to="/chat"
        className="flex items-center gap-4 text-black hover:text-[RGBA(0,106,199,1)] bg-transparent hover:bg-[RGBA(2,133,247,0.07)] rounded-xl"
      >
        <img src={Atendimento} alt="" />
        <p className="text-sm">Atendimento</p>
      </Link>
      <Link
        to="/perfil"
        className="flex items-center gap-4 text-black hover:text-[RGBA(0,106,199,1)] bg-transparent hover:bg-[RGBA(2,133,247,0.07)] rounded-xl"
      >
        <img src={Perfil} alt="" />
        <p className="text-sm">Meu Perfil</p>
      </Link>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div></div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <img src={As} alt="" />
        </div>
        <div>
          <p className="text-sm">Ana Souza</p>
          <p className="text-xs">ana.souza@nexo.com.br</p>
        </div>
      </div>
      <Link to="login" className="flex items-center gap-2">
        <img src={Sair} alt="" />
        <p className="text-sm">Sair</p>
      </Link>
    </section>
  );
};

export default Sidebar;
