import React, { useState, useEffect } from 'react';
import { ConversationService, type ConversationSession } from '../services/conversationService';
import { TicketService } from '../services/ticketService';
import type { Ticket } from '../types/ticket';
import enviar from '../assets/Enviar.png';

const Atendente: React.FC = () => {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('conv-101');
  const [filter, setFilter] = useState<'todos' | 'aguardando_analista' | 'em_atendimento'>('todos');
  const [replyText, setReplyText] = useState('');
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const list = ConversationService.getAllSessions();
    setSessions(list);
  };

  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  useEffect(() => {
    if (currentSession?.userEmail) {
      const tickets = TicketService.getTicketsByUser(currentSession.userEmail);
      setUserTickets(tickets);
    }
  }, [selectedSessionId, currentSession]);

  const handleAssume = () => {
    if (!currentSession) return;
    const updated = ConversationService.assumeConversation(currentSession.id);
    if (updated) {
      loadSessions();
    }
  };

  const handleReturnToAgent = () => {
    if (!currentSession) return;
    const updated = ConversationService.returnToAgent(currentSession.id);
    if (updated) {
      loadSessions();
    }
  };

  const handleCloseSession = () => {
    if (!currentSession) return;
    const updated = ConversationService.closeConversation(currentSession.id);
    if (updated) {
      loadSessions();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentSession) return;
    ConversationService.sendAnalystMessage(currentSession.id, replyText.trim());
    setReplyText('');
    loadSessions();
  };

  const filteredSessions = sessions.filter(s => {
    if (filter === 'todos') return true;
    return s.status === filter;
  });

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 text-gray-800">
      {/* Coluna 1: Lista de conversas e filtros (Tela 4 do protótipo) */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-sm text-gray-900 mb-2">Fila de Conversas</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('todos')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                filter === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('aguardando_analista')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                filter === 'aguardando_analista' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Aguardando
            </button>
            <button
              onClick={() => setFilter('em_atendimento')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                filter === 'em_atendimento' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Em Curso
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredSessions.map(session => (
            <div
              key={session.id}
              onClick={() => setSelectedSessionId(session.id)}
              className={`p-3.5 cursor-pointer transition text-xs ${
                session.id === selectedSessionId ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900">{session.userName}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    session.status === 'aguardando_analista'
                      ? 'bg-amber-100 text-amber-800'
                      : session.status === 'em_atendimento'
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'encerrada'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {session.status === 'aguardando_analista'
                    ? 'Aguardando Atendente'
                    : session.status === 'em_atendimento'
                    ? 'Em Atendimento'
                    : session.status === 'encerrada'
                    ? 'Encerrada'
                    : 'Com Agente'}
                </span>
              </div>
              <p className="text-gray-500 text-[11px] mb-1">Setor: {session.department}</p>
              {session.transferReason && (
                <p className="text-amber-800 bg-amber-50/80 p-1 rounded text-[11px] truncate">
                  Motivo: {session.transferReason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Coluna 2: Chat com o funcionário (Tela 5 do protótipo) */}
      <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
        {currentSession ? (
          <>
            {/* Header da conversa selecionada */}
            <div className="p-3.5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-900">{currentSession.userName}</h3>
                  <span className="text-xs text-gray-500">({currentSession.userEmail})</span>
                </div>
                <p className="text-xs text-gray-500">
                  Status: <strong>{currentSession.status}</strong> • Setor: {currentSession.department}
                </p>
              </div>

              {/* Ações do Analista (Assumir, Devolver, Encerrar) */}
              <div className="flex gap-2">
                {currentSession.status === 'aguardando_analista' && (
                  <button
                    onClick={handleAssume}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded font-medium shadow-xs cursor-pointer"
                  >
                    Assumir Atendimento
                  </button>
                )}

                {currentSession.status === 'em_atendimento' && (
                  <>
                    <button
                      onClick={handleReturnToAgent}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 text-xs px-3 py-1.5 rounded font-medium cursor-pointer"
                    >
                      Devolver ao Agente
                    </button>
                    <button
                      onClick={handleCloseSession}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-medium cursor-pointer shadow-xs"
                    >
                      Encerrar Chamado
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Histórico da Conversa */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentSession.messages.map(m => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] text-gray-400 mb-0.5">
                    {m.sender === 'user' ? currentSession.userName : m.sender === 'analyst' ? 'Você (Analista N1)' : 'Nexo Assist (Bot)'} • {m.timestamp}
                  </span>
                  <div
                    className={`p-3 rounded-xl text-xs max-w-lg ${
                      m.sender === 'user'
                        ? 'bg-gray-100 text-gray-800'
                        : m.sender === 'analyst'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 border border-blue-200 text-blue-900'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensagem para o analista responder */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={
                    currentSession.status === 'em_atendimento'
                      ? 'Digite sua resposta como Analista N1...'
                      : 'Assuma o atendimento para responder o funcionário...'
                  }
                  disabled={currentSession.status !== 'em_atendimento'}
                  className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={currentSession.status !== 'em_atendimento' || !replyText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <img src={enviar} alt="enviar" className="w-3.5 h-3.5" />
                  <span>Responder</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
            Selecione uma conversa ao lado para visualizar.
          </div>
        )}
      </div>

      {/* Coluna 3: Painel de Informações e Chamados do Funcionário (Histórias 2 e 3 do Analista) */}
      <div className="w-80 bg-white p-4 overflow-y-auto">
        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">
          Chamados do Funcionário
        </h3>

        {userTickets.length === 0 ? (
          <p className="text-xs text-gray-400">Nenhum chamado aberto encontrado.</p>
        ) : (
          <div className="space-y-3">
            {userTickets.map(t => (
              <div
                key={t.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1.5 hover:border-gray-300 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-700">{t.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      t.isOverdue
                        ? 'bg-red-100 text-red-700 font-bold'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {t.status} {t.isOverdue && '(VENCIDO)'}
                  </span>
                </div>
                <p className="font-semibold text-gray-900">{t.title}</p>
                <p className="text-gray-500 text-[11px] line-clamp-2">{t.description}</p>
                <div className="flex justify-between text-[11px] text-gray-500 border-t border-gray-200 pt-1.5 mt-1">
                  <span>Prioridade: <strong>{t.priority}</strong></span>
                  <span>Cat: {t.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Atendente;
