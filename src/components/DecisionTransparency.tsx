import React, { useState } from 'react';
import type { AgentActionLog } from '../types/agent';

interface DecisionTransparencyProps {
  actions: AgentActionLog[];
}

export const DecisionTransparency: React.FC<DecisionTransparencyProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!actions || actions.length === 0) return null;

  return (
    <div className="mb-2 w-full max-w-xl">
      {/* Linha de resumo com tags */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span className="font-bold text-gray-800">Nexo Assist</span>
        {actions.map((act, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {act.label}
          </span>
        ))}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-blue-600 hover:text-blue-800 underline ml-auto font-medium"
          title="Ver o que o agente entendeu, grau de segurança e por quê"
        >
          {isOpen ? 'Ocultar detalhes' : 'Por que fiz isso?'}
        </button>
      </div>

      {/* Painel expansível com detalhes das decisões (Critério principal do PRD) */}
      {isOpen && (
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-2">
          <p className="font-semibold text-gray-700 border-b pb-1">
            Transparência das Decisões do Agente:
          </p>
          {actions.map((act, idx) => (
            <div key={idx} className="bg-white p-2 rounded border border-gray-100">
              <div className="flex justify-between items-center text-gray-700 font-medium">
                <span>{act.label}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                  Confiança: {Math.round(act.confidence * 100)}%
                </span>
              </div>
              <p className="text-gray-600 mt-1"><span className="font-medium">Ação:</span> {act.details}</p>
              <p className="text-gray-500 italic mt-0.5"><span className="font-medium">Raciocínio:</span> {act.reasoning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
