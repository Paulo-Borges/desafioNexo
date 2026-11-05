import React, { useState, useEffect } from 'react';
import { 
  ConversationService, 
  type ConversationSession 
} from '../services/conversationService';
import { TicketService } from '../services/ticketService';
import type { Ticket } from '../types/ticket';
import { 
  Search, 
  Check, 
  CheckCheck, 
  MoreVertical, 
  X, 
  ChevronRight, 
  Headphones, 
  Undo2, 
  ExternalLink,
  Clock
} from 'lucide-react';
import NexoMark from '../assets/NexoMark.png';
import enviar from '../assets/Enviar.png';

const Atendente: React.FC = () => {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('conv-101');
  const [activeTab, setActiveTab] = useState<'todas' | 'para_voce' | 'com_agente' | 'minhas'>('para_voce');
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentSession) return;
    ConversationService.sendAnalystMessage(currentSession.id, replyText.trim());
    setReplyText('');
    loadSessions();
  };

  // Contadores para as abas
  const countParaVoce = sessions.filter(s => s.category === 'para_voce' || s.status === 'aguardando_analista').length;
  const countComAgent = sessions.filter(s => s.category === 'com_agente' || s.status === 'com_agente').length;
  const countMinhas = sessions.filter(s => s.category === 'minhas' || s.status === 'em_atendimento').length;

  const filteredSessions = sessions.filter(s => {
    // Filtro por pesquisa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.userName.toLowerCase().includes(q);
      const matchSnippet = s.lastMessageSnippet?.toLowerCase().includes(q);
      const matchTicket = s.relatedTicketId?.toLowerCase().includes(q);
      if (!matchName && !matchSnippet && !matchTicket) return false;
    }

    // Filtro por aba
    if (activeTab === 'todas') return true;
    if (activeTab === 'para_voce') return s.category === 'para_voce' || s.status === 'aguardando_analista';
    if (activeTab === 'com_agente') return s.category === 'com_agente' || s.status === 'com_agente';
    if (activeTab === 'minhas') return s.category === 'minhas' || s.status === 'em_atendimento';
    return true;
  });

  const activeTicket = userTickets.find(t => t.id === currentSession?.relatedTicketId) || userTickets[0];
  const otherTickets = userTickets.filter(t => t.id !== activeTicket?.id);

  return (
    <div className="flex h-full w-full overflow-hidden bg-white text-gray-800">
      
      {/* ========================================================= */}
      {/* COLUNA 1: Lista de Conversas (Inbox)                     */}
      {/* ========================================================= */}
      <div className="w-[340px] border-r border-gray-200 flex flex-col h-full bg-white shrink-0">
        
        {/* Topo: Logo Nexo + Título "Conversas" + Tag "Disponível" */}
        <div className="p-4 pb-3 border-b border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={NexoMark} alt="Nexo" className="w-6 h-6 object-contain" />
              <h1 className="font-bold text-lg text-gray-900 tracking-tight">Conversas</h1>
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200/80 rounded-full text-green-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Disponível
            </div>
          </div>

          {/* Barra de Busca */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pesquisar conversa ou chamado"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Abas de Filtro: Todas, Para você 3, Com o agent 9, Minhas 1 */}
          <div className="flex items-center gap-1 pt-1 text-xs">
            <button
              onClick={() => setActiveTab('todas')}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                activeTab === 'todas' ? 'bg-gray-200/80 text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveTab('para_voce')}
              className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'para_voce' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Para você <span className="text-[11px] font-bold text-blue-600">{countParaVoce}</span>
            </button>
            <button
              onClick={() => setActiveTab('com_agente')}
              className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'com_agente' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Com o agent <span className="text-[11px] font-bold text-gray-400">{countComAgent}</span>
            </button>
            <button
              onClick={() => setActiveTab('minhas')}
              className={`px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'minhas' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Minhas <span className="text-[11px] font-bold text-gray-400">{countMinhas}</span>
            </button>
          </div>
        </div>

        {/* Lista com scroll de conversas */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredSessions.map(session => {
            const isSelected = session.id === currentSession?.id;
            return (
              <div
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`p-3.5 flex gap-3 cursor-pointer transition relative ${
                  isSelected ? 'bg-blue-50/70 border-r-2 border-blue-600' : 'hover:bg-gray-50/80 bg-white'
                }`}
              >
                {/* Avatar com Iniciais */}
                <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                  session.avatarBg || 'bg-blue-100'
                } ${session.avatarColor || 'text-blue-700'}`}>
                  {session.initials || session.userName.substring(0, 2).toUpperCase()}
                </div>

                {/* Conteúdo central */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs text-gray-900 truncate">
                      {session.userName}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {session.lastMessageTime || '10:00'}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 truncate mb-1.5">
                    {session.lastMessageSnippet}
                  </p>

                  {/* Badges de Status específicos */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    {session.badgeType === 'transferida' && (
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {session.badgeText}
                      </span>
                    )}

                    {session.badgeType === 'pediu_ajuda' && (
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {session.badgeText}
                      </span>
                    )}

                    {session.badgeType === 'digitando' && (
                      <span className="flex items-center gap-1 text-green-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Agent atendendo
                      </span>
                    )}

                    {session.badgeType === 'agent_atendendo' && (
                      <span className="flex items-center gap-1 text-gray-400 font-normal">
                        <Check className="w-3 h-3 text-blue-500" />
                        Agent atendendo
                      </span>
                    )}

                    {session.badgeType === 'resolvida' && (
                      <span className="flex items-center gap-1 text-gray-400 font-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        Resolvida pelo agent
                      </span>
                    )}
                  </div>
                </div>

                {/* Contador de não lidas */}
                {session.unreadCount && session.unreadCount > 0 && (
                  <div className="absolute right-3.5 top-9 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {session.unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* COLUNA 2: Chat em Tempo Real + Header Fixo               */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col h-full bg-[#fafbfc] border-r border-gray-200 min-w-0">
        
        {/* Header FIXO da conversa */}
        {currentSession && (
          <header className="h-16 px-6 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs z-10">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                currentSession.avatarBg || 'bg-blue-100'
              } ${currentSession.avatarColor || 'text-blue-700'}`}>
                {currentSession.initials || currentSession.userName.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <h2 className="font-bold text-sm text-gray-900 leading-tight">
                  {currentSession.userName}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-emerald-600 font-medium">online</span>
                  <span>•</span>
                  <span>{currentSession.department}</span>
                  {currentSession.relatedTicketId && (
                    <>
                      <span>•</span>
                      <span className="text-gray-700 font-medium">{currentSession.relatedTicketId}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Badge de status "Aguardando atendente" */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {currentSession.status === 'aguardando_analista'
                    ? 'Aguardando atendente'
                    : currentSession.status === 'em_atendimento'
                    ? 'Em atendimento com analista'
                    : currentSession.status === 'encerrada'
                    ? 'Conversa encerrada'
                    : 'Em atendimento pelo Bot'}
                </span>
              </div>

              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Pesquisar">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Opções">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </header>
        )}

        {/* Área de Mensagens com scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-center my-2">
            <span className="px-3 py-0.5 bg-gray-200/70 text-gray-600 rounded-full text-[11px] font-medium">
              Hoje
            </span>
          </div>

          {currentSession?.messages.map((m) => {
            const isUser = m.sender === 'user';
            const isAnalyst = m.sender === 'analyst';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-start' : 'items-end'} max-w-xl ${
                  isUser ? 'mr-auto' : 'ml-auto'
                }`}
              >
                {/* Nome do remetente se for Agent / Analista */}
                {!isUser && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 font-medium">
                    <span>{isAnalyst ? 'Você (Analista N1)' : 'Nexo Assist'}</span>
                    <span className="px-1 bg-blue-100 text-blue-700 font-bold rounded text-[9px]">IA</span>
                  </div>
                )}

                {/* Balão de mensagem */}
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-xs'
                      : isAnalyst
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-gray-800 border border-gray-200/80 rounded-tr-xs'
                  }`}
                >
                  <p>{m.text}</p>
                </div>

                {/* Timestamp & checks */}
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 px-1">
                  <span>{m.timestamp}</span>
                  {!isUser && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            );
          })}

          {/* Notificação central de transferência (se houver) */}
          {currentSession?.status === 'aguardando_analista' && (
            <div className="flex justify-center my-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                <Undo2 className="w-3 h-3 text-gray-400 rotate-180" />
                <span>Transferida para Suporte N2 · {currentSession.transferredAt || '10:05'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Barra Flutuante de Ação: "Ana espera um atendente" + [Devolver ao agent] + [Assumir atendimento] */}
        {currentSession?.status === 'aguardando_analista' && (
          <div className="mx-6 mb-3 p-3 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                ✋
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  {currentSession.userName} espera um atendente
                </p>
                <p className="text-[11px] text-gray-500">
                  Agent pausado · até 12:05
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReturnToAgent}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                Devolver ao agent
              </button>

              <button
                onClick={handleAssume}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5" />
                Assumir atendimento
              </button>
            </div>
          </div>
        )}

        {/* Input de Mensagem */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendReply} className="flex gap-2 items-center">
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={
                currentSession?.status === 'em_atendimento'
                  ? 'Digite sua mensagem para o usuário...'
                  : 'Assuma o atendimento para responder'
              }
              disabled={currentSession?.status !== 'em_atendimento'}
              className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:bg-white transition disabled:bg-gray-100 disabled:text-gray-400"
            />
            <button
              type="submit"
              disabled={currentSession?.status !== 'em_atendimento' || !replyText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs px-4 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <img src={enviar} alt="enviar" className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COLUNA 3: Chamados da Usuária (Painel Lateral)            */}
      {/* ========================================================= */}
      <aside className="w-[340px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0">
        
        {/* Topo do painel lateral */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">
              Chamados da {currentSession?.userName.split(' ')[0] || 'Usuária'}
            </h3>
            <p className="text-[11px] text-gray-500">
              3 abertos · 2 encerrados
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Seção 1: Desta conversa */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Desta conversa
            </span>

            {activeTicket && (
              <div className="p-3.5 bg-white border border-amber-200 rounded-xl shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">{activeTicket.id}</span>
                  <span className="flex items-center gap-1 text-[10px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Aguardando analista
                  </span>
                </div>

                <h4 className="font-bold text-xs text-gray-900 leading-snug">
                  {activeTicket.title}
                </h4>

                <p className="text-[11px] text-gray-500">
                  {activeTicket.category} · prioridade {activeTicket.priority}
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Undo2 className="w-3 h-3 rotate-180" />
                    Transferido para um analista
                  </span>
                  <span>10:05</span>
                </div>
              </div>
            )}
          </div>

          {/* Seção 2: Outros chamados */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Outros chamados
            </span>

            <div className="space-y-2">
              {otherTickets.map(t => (
                <div
                  key={t.id}
                  className="p-3 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <p className="font-semibold text-xs text-gray-800 group-hover:text-blue-600 transition">
                        {t.title}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 pl-3">
                      {t.id} · {t.status}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
                </div>
              ))}

              {/* Chamados adicionais para completar a lista idêntica ao design */}
              <div className="p-3 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 transition cursor-pointer flex items-center justify-between group">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <p className="font-semibold text-xs text-gray-800 group-hover:text-blue-600 transition">
                      Acesso à pasta Financeiro
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3">
                    INC-20298 · Em andamento
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
              </div>

              <div className="p-3 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 transition cursor-pointer flex items-center justify-between group">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <p className="font-semibold text-xs text-gray-800 group-hover:text-blue-600 transition">
                      Segundo monitor para home office
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3">
                    REQ-10442 · Aprovado
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
              </div>

              <div className="p-3 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 transition cursor-pointer flex items-center justify-between group">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <p className="font-semibold text-xs text-gray-600 group-hover:text-blue-600 transition">
                      Outlook não sincroniza no celular
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3">
                    INC-19877 · Resolvido em 02 set
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
              </div>

              <div className="p-3 bg-white border border-gray-200/80 rounded-xl hover:border-gray-300 transition cursor-pointer flex items-center justify-between group">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <p className="font-semibold text-xs text-gray-600 group-hover:text-blue-600 transition">
                      Troca de senha da rede
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-3">
                    INC-19410 · Resolvido em 11 jul
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do painel lateral */}
        <div className="p-3 border-t border-gray-100 bg-white">
          <button className="w-full py-2 text-center text-xs font-semibold text-gray-600 hover:text-blue-600 transition flex items-center justify-center gap-1 cursor-pointer">
            <span>Ver todos os chamados da {currentSession?.userName.split(' ')[0] || 'Usuária'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Atendente;
