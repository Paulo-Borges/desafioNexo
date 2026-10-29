import React from "react";
import { Link } from "react-router-dom";
import nexoBranco from "../../assets/nexoBranco.png";

const LoginForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  return (
    <section className="flex ">
      <div className="bg-[rgba(27,36,48,1)] flex-1 p-8">
        <img
          src={nexoBranco}
          alt="Nexo Logo"
          style={{ width: "130px", height: "auto" }}
          className="mb-16"
        />

        <p className="text-gray-500 mb-4">Service desk de TI da Nexo</p>
        <h1
          className="text-white text-5xl"
          style={{ width: "672px", height: "112px" }}
        >
          Seu problema de TI, resolvido em uma conversa.
        </h1>
        <p className="text-gray-500 mb-4 w-125">
          Descreva o que está acontencendo. O assistente consula seus chamados,
          busca na central de ajuda e chama um analista quando precisa.
        </p>
        <div className="bg-[rgba(255,255,255,0.04)] p-4 rounded-2xl mb-4 w-125 ml-36 ">
          <div className="flex justify-end right-0 p-2">
            <p className="bg-amber-50 p-2 rounded-l-2xl rounded-tr-2xl text-sm">
              Meu notebook não conecta ma VPN. erro 809.
            </p>
          </div>
          <p className="text-white text-xs mb-2">
            Nexo Assist
            <span className="text-gray-500">
              consultou seus chamados . criou um chamado
            </span>
          </p>
          <div className=" p-4 rounded mb-4">
            <p className="text-white text-xs rounded-r-2xl rounded-bl-2xl w-80 bg-[rgba(255,255,255,0.08)] p-2">
              Pronto: abri o chama do comprioridade alta. Um analista fala com
              você em até 4h Uteis.
            </p>
          </div>
          <div className="flex justify-start p-2">
            <p className="bg-amber-50 p-2 rounded-2xl text-sm">
              . INC-20517 rede e VPN . Alta . em até 4h
            </p>
          </div>
        </div>
        <div className="flex border-t-[0.1px] border-gray-600 mt-16 mb-8">
          <div className="flex-1 mt-8">
            <p className="text-white text-3xl">8s</p>
            <p className="text-gray-500">Primeira resposta, em média</p>
          </div>
          <div className="flex-1 mt-8">
            <p className="text-white text-3xl">72%</p>
            <p className="text-gray-500">Resolvidos sem fila</p>
          </div>

          <div className="flex-1 mt-8">
            <p className="text-white text-3xl">6°</p>
            <p className="text-gray-500">analistas online agora</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 flex-1 p-8">
        <div className="flex justify-end">
          <h1 className="text-sm text-gray-500">
            Problema para entrar?{" "}
            <span className="text-[rgba(0,98,196,1)]">
              Ligue pra (21)98614-9579
            </span>
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col mt-46 w-132">
          <h1 className="text-4xl mb-4">Entrar</h1>
          <p className="text-gray-500 mb-4">
            Use seu e-mail corporativo e a senha da rede Neco.
          </p>
          <label htmlFor="username" className="block mb-1 text-sm">
            E-mail corporativo
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="border border-gray-400 rounded-xl p-2 mb-2"
          />
          <div className="flex justify-between items-center mt-4">
            <label htmlFor="password" className="block mb-1 text-sm">
              Senha
            </label>
            <Link
              to="/login/esqueci"
              className="text-sm text-[rgba(0,98,196,1)] hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <input
            type="password"
            name="password"
            id="password"
            className="border border-gray-400 rounded-xl p-2 mb-2"
          />

          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-sm mt-2 mb-2">
              Manter conectado neste computador
            </span>
          </label>
          <button
            type="submit"
            className="bg-[rgba(0,98,196,1)] hover:bg-[#496a8c] rounded-xl p-2 mb-4"
          >
            <p className="text-white text-center">Entrar</p>
          </button>
        </form>

        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm flex justify-center mt-40">
            © 2026 Nexo Service desk de TI
          </p>
          <div className="mt-40">
            <Link
              to="/login/criar"
              className="pointer border-none text-sm text-[rgba(0,98,196,1)] hover:underline rounded p-2"
            >
              cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
