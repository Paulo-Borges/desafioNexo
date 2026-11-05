import React from "react";
import { 
  Bot, 
  MessageSquare, 
  Layers, 
  Radio, 
  Database, 
  BarChart2, 
  Search, 
  MoreHorizontal 
} from "lucide-react";

const DarkSidebar: React.FC = () => {
  return (
    <aside className="w-14 bg-[#1e2430] text-gray-400 flex flex-col items-center py-3 justify-between border-r border-gray-800 shrink-0 select-none z-30">
      {/* Top Icons */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Toggle / Panel icon */}
        <button className="p-2 hover:text-white hover:bg-gray-800 rounded-lg transition" title="Menu">
          <Layers className="w-5 h-5" />
        </button>

        <div className="w-8 h-[1px] bg-gray-700/60 my-1" />

        {/* Navigation items */}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition" title="Automações / Fluxos">
          <Bot className="w-5 h-5" />
        </button>

        {/* Active item: Atendente / Conversas */}
        <button 
          className="relative p-2 text-white bg-blue-600/30 text-blue-400 rounded-xl transition shadow-xs flex items-center justify-center" 
          title="Atendimento - Conversas"
        >
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#1e2430]">
            5
          </span>
        </button>

        <button className="p-2 hover:text-white hover:bg-gray-800 rounded-lg transition" title="Canais / Broadcast">
          <Radio className="w-5 h-5" />
        </button>

        <button className="p-2 hover:text-white hover:bg-gray-800 rounded-lg transition" title="Base de Conhecimento">
          <Database className="w-5 h-5" />
        </button>

        <button className="p-2 hover:text-white hover:bg-gray-800 rounded-lg transition" title="Relatórios e Métricas">
          <BarChart2 className="w-5 h-5" />
        </button>

        <button className="p-2 hover:text-white hover:bg-gray-800 rounded-lg transition" title="Pesquisa Geral">
          <Search className="w-5 h-5" />
        </button>

        <button className="p-2 hover:text-white hover:bg-gray-800 rounded-lg transition" title="Mais opções">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Profile Avatar */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-teal-600/40 border border-teal-400/50 flex items-center justify-center text-teal-300 font-bold text-xs shadow-xs cursor-pointer hover:ring-2 hover:ring-teal-400/30">
          RL
        </div>
      </div>
    </aside>
  );
};

export default DarkSidebar;
