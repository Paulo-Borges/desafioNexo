import React, { useState, useEffect, useRef } from 'react';
import { AgentService, type ConversationState } from '../services/agentService';
import type { AgentActionLog, TicketDraft } from '../types/agent';
import type { Ticket } from '../types/ticket';
import { DecisionTransparency } from '../components/DecisionTransparency';
import enviar from '../assets/Enviar.png';
import confirmarIcon from '../assets/Confirmar.png';

interface Message {
  id: string;
  sender: 'user' | 'agent' | 'analyst';
  text: string;
  timestamp: string;
  actions?: AgentActionLog[];
  options?: string[];
  draft?: TicketDraft;
  tickets?: Ticket[];
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      text: 'Olá! Sou o **Nexo Assist**, o assistente virtual do Service Desk de TI. Como posso te ajudar hoje? Você pode tirar dúvidas sobre sistemas, consultar chamados abertos ou relatar um problema técnico.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: ['Consultar meus chamados', 'Problema com VPN', 'Pedir novo monitor', 'Falar com analista']
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: 'IDLE',
    isTransferredToAnalyst: false
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const userEmail = 'borges@nexo.com.br'; // Usuário logado padrão

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || loading) return;

    // Adiciona a mensagem do usuário
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      // Simula uma pequena latência realista de processamento do agente
      await new Promise(r => setTimeout(r, 600));

      const { decision, nextState } = await AgentService.processMessage(
        messageContent,
        userEmail,
        conversationState
      );

      setConversationState(nextState);

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        sender: nextState.isTransferredToAnalyst ? 'analyst' : 'agent',
        text: decision.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: decision.actions,
        options: decision.options,
        draft: decision.draft,
        tickets: decision.tickets
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: 'Ocorreu uma instabilidade momentânea no serviço legado de chamados. Por favor, tente novamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4 py-4">
      {/* Alerta de status de transferência para analista humano */}
      {conversationState.isTransferredToAnalyst && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              <strong>Atendimento transferido:</strong> O Nexo Assist está em pausa. Aguardando analista N1/N2 assumir.
            </span>
          </div>
          <button
            onClick={() => {
              setConversationState({ step: 'IDLE', isTransferredToAnalyst: false });
              setMessages(prev => [
                ...prev,
                {
                  id: `ret-${Date.now()}`,
                  sender: 'agent',
                  text: 'Atendimento com analista encerrado. O Nexo Assist está ativo novamente.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }}
            className="text-amber-900 underline font-semibold hover:text-black cursor-pointer"
          >
            Retomar com Nexo Assist
          </button>
        </div>
      )}

      {/* Área das mensagens */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            {/* Mensagem do Usuário */}
            {msg.sender === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-black text-white text-xs max-w-lg px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm">
                  {msg.text}
                </div>
              </div>
            ) : (
              /* Mensagem do Agente / Analista */
              <div className="flex flex-col items-start space-y-2">
                {/* Transparência e ações do agente */}
                {msg.actions && msg.actions.length > 0 && (
                  <DecisionTransparency actions={msg.actions} />
                )}

                {/* Balão de texto */}
                <div className="bg-white border border-gray-200 text-gray-800 text-xs max-w-xl p-4 rounded-xl rounded-tl-sm shadow-xs space-y-2 leading-relaxed">
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Renderização de Cards de Chamados Encontrados */}
                  {msg.tickets && msg.tickets.length > 0 && (
                    <div className="mt-3 space-y-2 border-t pt-2">
                      <p className="font-semibold text-gray-700">Chamados vinculados:</p>
                      {msg.tickets.map((t) => (
                        <div key={t.id} className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-blue-700">{t.id}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                t.isOverdue
                                  ? 'bg-red-100 text-red-700 font-bold'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {t.status} {t.isOverdue && '(PRAZO VENCIDO)'}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">{t.title}</p>
                          <p className="text-gray-500 text-[11px]">
                            Prioridade: <strong>{t.priority}</strong> | Categoria: {t.category}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Renderização de Rascunho para Confirmação (Tela 2 do protótipo) */}
                  {msg.draft && (
                    <div className="mt-3 border border-blue-200 bg-blue-50/40 p-3 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                        <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide">
                          Rascunho de Novo Chamado
                        </span>
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                          Aguardando confirmação
                        </span>
                      </div>

                      <div>
                        <p className="font-bold text-gray-900 text-xs">{msg.draft.title}</p>
                        <p className="text-gray-600 text-xs mt-1">{msg.draft.description}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-2 rounded border border-blue-100">
                        <div>
                          <p className="text-gray-400 font-medium">Tipo / Categoria</p>
                          <p className="font-semibold text-gray-800">{msg.draft.type} • {msg.draft.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Prioridade / SLA</p>
                          <p className="font-semibold text-gray-800">{msg.draft.priority} ({msg.draft.deadlineText})</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">Afetados</p>
                          <p className="font-semibold text-gray-800 capitalize">{msg.draft.scope}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleSendMessage('Confirmar')}
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium cursor-pointer shadow-xs"
                        >
                          <img src={confirmarIcon} alt="confirmar" className="w-3.5 h-3.5" />
                          Confirmar abertura
                        </button>
                        <button
                          onClick={() => handleSendMessage('Cancelar')}
                          className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-medium cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Renderização de Opções Rápidas (Pills de botões) */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer hover:border-blue-400"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Indicador de digitando / processamento */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
            <span>Nexo Assist está analisando as regras e buscando na base...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Barra de entrada de texto */}
      <div className="mt-4 pt-2 border-t border-gray-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2 shadow-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder={
              conversationState.isTransferredToAnalyst
                ? 'Atendimento transferido para o analista...'
                : 'Escreva para o Nexo Assist (ex: "VPN não conecta", "Consultar meus chamados")...'
            }
            className="flex-1 text-xs text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition"
          >
            <img src={enviar} alt="enviar" className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>
        <p className="text-[11px] text-gray-400 text-center mt-1.5">
          Limite de 30 mensagens por sessão corporativa • Nexo Assist v1.0
        </p>
      </div>
    </div>
  );
};

export default Chat;
