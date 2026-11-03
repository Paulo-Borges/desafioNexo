import cadeado from "../assets/cadeado.png";
import chave from "../assets/chave.png";
import email from "../assets/email.png";
import redefinir from "../assets/redefinir.png";

const Perfil = () => {
  return (
    <div className="w-screen flex  py-30 px-40 items-center justify-center">
      <div className="items-center justify-center">
        <h1 className="text-2xl font-bold -ml-18">Meu Perfil</h1>
        <p className="-ml-18 text-xs text-gray-500 mb-6">
          Seus dados de acesso ao service desk de TI.
        </p>

        <div className="border -ml-18 border-gray-200 p-4 rounded-xl mb-6">
          <div className="flex  text-xs space-x-32 border-b border-gray-200 space-y-2 mb-4 pb-4">
            <p className="text-gray-500">Nome</p>
            <p>Ana Souza</p>
          </div>
          <div className="flex text-xs gap-16  space-y-2 mb-2">
            <p className="text-gray-500">Email corporativo</p>
            <p className="font-semibold">ana.souza@nexo.com.br</p>
            <div className="flex items-center">
              <div className="text-gray-500 flex items-center">
                <img src={cadeado} alt="" className="w-4 h-4 mr-2" /> Gerenciado
                pela TI
              </div>
            </div>
          </div>
        </div>

        <div className="border -ml-18 border-gray-200 rounded-xl mb-6">
          <div className="flex  text-xs space-x-32 border-b border-gray-200 items-center justify-center space-y-2 ">
            <div className="flex text-gray-500">
              <div>
                <img src={chave} alt="" className="w-10 h-10 rounded-full" />
              </div>
              <div>
                <p>Senha</p>
                <p>Alterada há 42 dias</p>
              </div>
            </div>
            <div>
              <button className="flex items-center text-xs text-blue-500">
                <img src={redefinir} alt="" className="w-4 h-4 mr-2" />
                <p>Redefinir Senha</p>
              </button>
            </div>
          </div>
          <div className="flex text-xs gap-2 bg-gray-100 p-4 rounded-b-2xl">
            <img src={email} alt="" className="w-4 h-4 " />
            <p className="text-gray-500">
              Enviaremos um link de redefinição para ana.souza@nexo.com.br.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
