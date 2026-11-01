import Visto from "../assets/visto.png";
import confirmar from "../assets/confirmar.png";
import enviar from "../assets/Enviar.png";

const Chat = () => {
  return (
    <div className="h-screen w-screen flex flex-col py-30 px-40 items-center justify-center">
      <div className="flex justify-end right-30 mb-8">
        <p className=" text-white text-sm bg-black px-8 py-4 mt-40 rounded-l-2xl rounded-tr-2xl">
          Meu Notebook não conecta na VPN desde ontem. aparece o erro 809.
        </p>
      </div>

      <div className="flex flex-col h-screen items-center justify-center">
        <div className="flex mb-2 ">
          <p>Nexo Assist</p>
          <img src={Visto} alt="description" />
          <p>consultou seus chamados</p>
          <img src={Visto} alt="description" />
          <p>buscou na central de ajuda</p>
        </div>
        <div className="flex flex-col ">
          <p>
            Não há chamado aberto dobre VPN, e o artigo do erro 809 vale só para
            Windows 10
          </p>
          <p>_o seu é Windows 11. Vou abrir chamado</p>
          <p>Quem está sendo afetado?</p>
          <div>
            <button>Só eu</button>
            <button>Minha equipe</button>
            <button>Toda a empresa</button>
            <button>Não sei</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end right-30 mb-8">
        <p className=" text-white text-sm bg-black px-8 py-4 mt-4 rounded-l-2xl rounded-tr-2xl">
          Só eu. tenho reunião com um cliente às 14h e precido da VPN
          funcionando
        </p>
      </div>

      <div className="flex flex-col h-screen items-center justify-start ">
        <div className="flex justify-center mb-2 ">
          <p>Nexo Assist</p>
          <img src={Visto} alt="description" />
          <p>classificou a prioridade</p>
          <img src={Visto} alt="description" />
          <p>consultou o SLA</p>
          <img src={Visto} alt="description" />
          <p>montou o rascunho</p>
        </div>

        <div className="flex flex-col justify-start ">
          <p>Coloquei prioridade alta no chamado</p>
          <p>Confira antes de eu criar o chamado</p>
        </div>

        <div className="flex flex-col ">
          <p>Novo chamado - Rascunho D-381</p>
          <p>VPN não conecta no notebook - erro 809</p>
          <p>
            Desde 20/10 o notebook (Windows 11) não consegue conectar na VPN
          </p>
          <div>
            <div>
              <p>Categoria</p>
              <p>Rede e Vpn</p>
            </div>
            <div>
              <p>Prioridade</p>
              <p>Alta . resposta até 13:43</p>
            </div>
            <div>
              <p>afetados</p>
              <p>Somente você</p>
            </div>
          </div>
        </div>
        <div>
          <button>
            <p>Confirmar</p>
            <img src={confirmar} alt="description" />
          </button>
          <button>Editar</button>
          <button>Cancelar</button>
        </div>
      </div>
      <div className="flex  h-screen items-center justify-center gap-9 bg-gray-100">
        <input
          className="border p-2 rounded "
          type="text"
          placeholder="Escreva para o Nexo..."
        />
        <button className="flex items-center gap-2 bg-[RGBA(0,0,0,0.1)]">
          <img src={enviar} alt="description" />
          <p>Enviar</p>
        </button>
      </div>
    </div>
  );
};

export default Chat;
