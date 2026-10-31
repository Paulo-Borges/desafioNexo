import NexoLogo from "../assets/nexoLogo.png";
import Atendimento from "../assets/atendimento.png";
import Perfil from "../assets/perfil.png";
import As from "../assets/As.png";
import Sair from "../assets/sair.png";

const Sidebar = () => {
  return (
    <section className="bg-white fixed left-0 h-full z-50 flex flex-col p-4 space-y-6 border border-l-mist-200 ">
      <div>
        <img src={NexoLogo} alt="" />
      </div>
      <div className="flex items-center gap-4">
        <img src={Atendimento} alt="" />
        <p>Atendimento</p>
      </div>
      <div className="flex items-center gap-4">
        <img src={Perfil} alt="" />
        <p>Meu Perfil</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div></div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <img src={As} alt="" />
        </div>
        <div>
          <p>Ana Souza</p>
          <p>online . Financeiro. INC-20311</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <img src={Sair} alt="" />
        <p>Sair</p>
      </div>
    </section>
  );
};

export default Sidebar;
