import React, { useState } from "react";
import { UserContext, type UserProfile } from "../../UserContext";
import { Link, useNavigate } from "react-router-dom";
import nexoBranco from "../../assets/nexoBranco.png";
import { User, ShieldCheck } from "lucide-react";

const DEMO_PROFILES: UserProfile[] = [
  {
    name: "Ana Souza",
    email: "ana.souza@nexo.com.br",
    role: "colaborador",
    department: "Financeiro"
  },
  {
    name: "Lucas Ribeiro",
    email: "lucas.ribeiro@nexo.com.br",
    role: "analista",
    department: "Service Desk N1/N2"
  }
];

const LoginForm: React.FC = () => {
  const context = React.useContext(UserContext);
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<"colaborador" | "analista">("colaborador");
  const [email, setEmail] = useState<string>("ana.souza@nexo.com.br");
  const [password, setPassword] = useState<string>("••••••••");

  const handleSelectRole = (role: "colaborador" | "analista") => {
    setSelectedRole(role);
    const profile = DEMO_PROFILES.find(p => p.role === role)!;
    setEmail(profile.email);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const profile = DEMO_PROFILES.find(p => p.role === selectedRole) || DEMO_PROFILES[0];
    
    if (context?.setUser) {
      context.setUser(profile);
    }

    if (profile.role === "analista") {
      navigate("/atendente");
    } else {
      navigate("/chat");
    }
  };

  return (
    <section className="flex min-h-screen w-full bg-white">
      {/* Coluna Esquerda: Apresentação Nexo (Tela 1 do Protótipo) */}
      <div className="bg-[#1b2430] w-1/2 p-12 flex flex-col justify-between shrink-0">
        <div>
          <img
            src={nexoBranco}
            alt="Nexo Logo"
            className="w-32 mb-12"
          />

          <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase mb-3">
            Service desk de TI da Nexo
          </p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-xl">
            Seu problema de TI, resolvido em uma conversa.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-lg">
            Descreva o que está acontecendo. O assistente consulta seus chamados,
            busca na central de ajuda e chama um analista quando precisa.
          </p>

          {/* Card Mock da conversa no Login */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl max-w-lg space-y-3">
            <div className="flex justify-end">
              <p className="bg-white text-gray-900 px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs font-medium shadow-xs">
                Meu notebook não conecta na VPN. erro 809.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-white text-xs font-bold flex items-center gap-1.5">
                <span>Nexo Assist</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  • consultou seus chamados • verificou central de ajuda
                </span>
              </p>
              <p className="text-gray-300 text-xs bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                Identifiquei que você está no Windows 11. O erro 809 requer liberação de certificado no firewall. Deseja abrir um chamado?
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-xs">
          © 2026 Nexo Service Desk de TI • Processo Seletivo Beyond the Bytes
        </p>
      </div>

      {/* Coluna Direita: Formulário de Login com Seletor Rápido de Perfil */}
      <div className="w-1/2 p-12 flex flex-col justify-between bg-white overflow-y-auto">
        <div className="flex justify-end">
          <p className="text-xs text-gray-500">
            Problema para entrar?{" "}
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              Ligue para (21) 98614-9579
            </span>
          </p>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Entrar</h2>
          <p className="text-gray-500 text-xs mb-6">
            Use seu e-mail corporativo ou selecione um perfil de demonstração abaixo:
          </p>

          {/* SELETOR DE PERFIL INTERATIVO (ORIGINAL & PROFISSIONAL) */}
          <div className="mb-6 p-1.5 bg-gray-100 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => handleSelectRole("colaborador")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                selectedRole === "colaborador"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Colaborador (Chat)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole("analista")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                selectedRole === "analista"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Analista N1 (Console)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1.5 text-xs font-semibold text-gray-700">
                E-mail corporativo
              </label>
              <input
                type="text"
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                  Senha da rede Nexo
                </label>
                <Link
                  to="/login/esqueci"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300" 
              />
              <span className="text-xs text-gray-600">
                Manter conectado neste computador
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 text-xs transition cursor-pointer shadow-xs mt-2"
            >
              {selectedRole === "analista" ? "Entrar como Analista de Suporte" : "Entrar como Colaborador"}
            </button>
          </form>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>© 2026 Nexo</span>
          <Link
            to="/login/criar"
            className="text-blue-600 hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
