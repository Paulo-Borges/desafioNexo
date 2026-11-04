import type { Ticket, TicketCategory, TicketPriority, TicketType } from './ticket';

export interface AgentActionLog {
  label: string; // Ex: "consultou seus chamados", "buscou na central de ajuda", "classificou a prioridade"
  details: string; // Ex: "Busca retornou artigo 'VPN com erro 809'"
  confidence: number; // Grau de segurança: 0.0 a 1.0 (Ex: 0.95 = 95%)
  reasoning: string; // "Identificado que o artigo só se aplica ao Windows 10, portanto requer abertura de chamado"
  timestamp: string;
}

export interface TicketDraft {
  title: string;
  description: string;
  type: TicketType;
  category: TicketCategory;
  priority: TicketPriority;
  scope: 'individual' | 'equipe' | 'empresa';
  deadlineText: string;
}

export interface AgentDecision {
  type: 
    | 'ANSWER_QUESTION'      // Responde com artigo/informação
    | 'ASK_CLARIFICATION'    // Pergunta opções (ex: "Quem está sendo afetado?")
    | 'LIST_TICKETS'          // Exibe cards dos chamados do usuário
    | 'CONFIRM_DRAFT'        // Mostra o rascunho do chamado para o usuário confirmar antes de criar
    | 'TICKET_CREATED'       // Notifica que o chamado foi criado com sucesso
    | 'TRANSFER_TO_ANALYST'  // Transfere para atendente humano e pausa o bot
    | 'OUT_OF_SCOPE';        // Assuntos de RH, financeiro, facilities redirecionados

  replyText: string;
  actions: AgentActionLog[];
  options?: string[]; // Opções de botões rápidos para o usuário clicar
  draft?: TicketDraft; // Rascunho para confirmação
  tickets?: Ticket[]; // Chamados relacionados encontrados
  transferReason?: string;
}
