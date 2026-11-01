import Menor from "../assets/Menor.png";
import Verde from "../assets/Verde.png";

const Header = () => {
  return (
    <div className="fixed top-0 flex justify-between p-4 right-0 left-60 z-40 bg-gray-100">
      <div className="flex items-center space-x-6">
        <p>Service desk de TI</p>
        <img src={Menor} alt="Logo" />
        <p className="font-bold">Atendimento</p>
      </div>

      <div className="flex items-center space-x-6 bg-[RGBA(0,189,107,0.08)] px-2 py-1 rounded-2xl">
        <div>
          <img src={Verde} alt="Logo" />
        </div>
        <p className="text-[RGBA(0,128,74,1)]">Assistente online</p>
      </div>
    </div>
  );
};

export default Header;
