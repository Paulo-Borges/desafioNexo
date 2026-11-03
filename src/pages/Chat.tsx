import Visto from "../assets/visto.png";
import confirmar from "../assets/confirmar.png";
import enviar from "../assets/Enviar.png";

const Chat = () => {
  return (
    <div className="h-screen w-screen flex flex-col py-30 px-40 items-center justify-center">
      <div className="flex justify-end right-30 mb-8">
        <p className=" text-white text-sm bg-black px-8 py-4 rounded-l-2xl rounded-tr-2xl ml-90">
          Meu Notebook não conecta na VPN desde ontem. aparece o erro 809.
        </p>
      </div>

      <div className="flex flex-col h-screen items-center justify-center">
        <div className="flex justify-center items-center space-x-2 mb-2 ">
          <p className="font-bold text-xs -ml-18">Nexo Assist</p>
          <img
            src={Visto}
            style={{ width: "8px", height: "8px" }}
            alt="description"
          />
          <p className="text-xs">consultou seus chamados</p>
          <img
            src={Visto}
            style={{ width: "8px", height: "8px" }}
            alt="description"
          />
          <p className="text-xs">buscou na central de ajuda</p>
        </div>
        <div className="flex flex-col text-xs border border-gray-200 p-4 rounded-xl space-y-2 ">
          <p>
            Não há chamado aberto dobre VPN, e o artigo do erro 809 vale só para
            Windows 10
          </p>
          <p>_o seu é Windows 11. Vou abrir chamado</p>
          <p className="font-bold">Quem está sendo afetado?</p>
          <div className="flex space-x-2">
            <button className="bg-transparent hover:bg-[RGBA(2,133,247,0.07)] text-black hover:text-[RGBA(0,106,199,1)] border border-gray-200 p-2 rounded">
              Só eu
            </button>
            <button className="bg-transparent hover:bg-[RGBA(2,133,247,0.07)] text-black hover:text-[RGBA(0,106,199,1)] border border-gray-200 p-2 rounded">
              Minha equipe
            </button>
            <button className="bg-transparent hover:bg-[RGBA(2,133,247,0.07)] text-black hover:text-[RGBA(0,106,199,1)] border border-gray-200 p-2 rounded">
              Toda a empresa
            </button>
            <button className="bg-transparent hover:bg-[RGBA(2,133,247,0.07)] text-black hover:text-[RGBA(0,106,199,1)] border border-gray-200 p-2 rounded">
              Não sei
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end right-30 mb-8">
        <p className=" text-white text-sm bg-black px-8 py-4 mt-4 rounded-l-2xl rounded-tr-2xl ml-90">
          Só eu. tenho reunião com um cliente às 14h e precido da VPN
          funcionando
        </p>
      </div>

      <div className="flex flex-col h-screen items-center justify-center">
        <div className="flex justify-center items-center space-x-2 mb-2 ">
          <p className="font-bold text-xs">Nexo Assist</p>
          <img
            src={Visto}
            style={{ width: "8px", height: "8px" }}
            alt="description"
          />
          <p className="text-xs">classificou a prioridade</p>
          <img
            src={Visto}
            style={{ width: "8px", height: "8px" }}
            alt="description"
          />
          <p className="text-xs">consultou o SLA</p>
          <img
            src={Visto}
            style={{ width: "8px", height: "8px" }}
            alt="description"
          />
          <p className="text-xs">montou o rascunho</p>
        </div>

        <div className="flex flex-col -ml-18 text-xs border border-gray-200 p-4 rounded-xl space-y-2 mb-2">
          <p>
            Coloquei prioridade alta no chamado - a resposta chega antes das
            14h.
          </p>
          <p>Confira antes de eu criar o chamado</p>
        </div>

        <div className="flex flex-col text-xs border ml-12 border-gray-200 p-4 rounded-xl space-y-2 ">
          <div className="flex justify-between items-center">
            <p className="text-xs">Novo chamado - Rascunho D-381</p>
            <div className="flex items-center space-x-6 bg-[RGBA(0,189,107,0.08)] px-2 py-1 rounded-2xl">
              <p className="text-[RGBA(148,99,0,1)]">Aguardando confirmação</p>
            </div>
          </div>
          <p className="font-bold">VPN não conecta no notebook - erro 809</p>
          <p className="text-xs border-b border-gray-200 pb-2">
            Desde 20/10 o notebook (Windows 11) não consegue conectar na VPN e
            apresenta o erro 809.
          </p>
          <div className="flex space-x-9">
            <div>
              <p className="text-sm">Categoria</p>
              <p className="text-xs">Rede e Vpn</p>
            </div>
            <div>
              <p className="text-xs">Prioridade</p>
              <p className="text-xs">Alta . resposta até 13:43</p>
            </div>
            <div>
              <p className="text-xs">afetados</p>
              <p className="text-xs">Somente você</p>
            </div>
          </div>

          <div className="flex space-x-2 bg-gray-100 p-2 rounded-b-xl">
            <button className="flex items-center gap-2 bg-[RGBA(0,98,196,1)] hover:bg-[RGBA(0,98,196,0.8)] hover:text-white p-2 rounded">
              <p>Confirmar</p>
              <img src={confirmar} alt="description" />
            </button>
            <button className="flex items-center gap-2 bg-white hover:bg-[RGBA(0,98,196,0.8)] hover:text-white p-2 rounded">
              Editar
            </button>
            <button className="text-black hover:text-[RGBA(0,98,196,0.8)]">
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <div className="flex  h-screen items-center justify-center gap-72 ml-11 border border-gray-200 mt-2 rounded-xl w-auto pr-2">
        <input
          className=" p-2 rounded text-xs"
          type="text"
          placeholder="Escreva para o Nexo..."
        />
        <button className="flex items-center gap-2 px-2 py-1 rounded bg-[RGBA(0,98,196,0.8)] hover:bg-[RGBA(0,98,196,1)] text-white ">
          <img src={enviar} alt="description" />
          <p className="text-xs ">Enviar</p>
        </button>
      </div>
    </div>
  );
};

export default Chat;
