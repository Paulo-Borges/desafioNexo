export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'agent' | 'analyst';
  text: string;
  timestamp: string;
}

export interface ConversationSession {
  id: string;
  userEmail: string;
  userName: string;
  department: string;
  status: 'com_agente' | 'aguardando_analista' | 'em_atendimento' | 'encerrada';
  transferredAt?: string;
  transferReason?: string;
  messages: ChatMessageItem[];
  relatedTicketId?: string;
}

const SESSIONS_STORAGE_KEY = 'nexo_chat_sessions_storage';

export const initialMockSessions: ConversationSession[] = [
  {
    id: 'conv-101',
    userEmail: 'borges@nexo.com.br',
    userName: 'Borges Silva',
    department: 'Marketing',
    status: 'aguardando_analista',
    transferredAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    transferReason: 'Chamado INC-20311 vencido há mais de 3 dias sem resposta.',
    relatedTicketId: 'INC-20311',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Olá, meu notebook continua muito lento após a atualização e meu chamado está sem resposta há dias.',
        timestamp: '14:20'
      },
      {
        id: 'm2',
        sender: 'agent',
        text: 'Identifiquei que o chamado INC-20311 está com o prazo estipulado vencido. Estou transferindo você para um analista do Service Desk.',
        timestamp: '14:21'
      }
    ]
  },
  {
    id: 'conv-102',
    userEmail: 'mariana.costa@nexo.com.br',
    userName: 'Mariana Costa',
    department: 'Vendas',
    status: 'em_atendimento',
    transferredAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    transferReason: 'Bloqueio de acesso ao CRM antes de fechamento de contrato.',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        text: 'Preciso urgente acessar o Salesforce, está dando erro de token.',
        timestamp: '13:50'
      },
      {
        id: 'm4',
        sender: 'analyst',
        text: 'Olá Mariana, analista Lucas assumindo o chamado. Estou verificando seu perfil de permissões.',
        timestamp: '13:55'
      }
    ]
  },
  {
    id: 'conv-103',
    userEmail: 'carlos.oliveira@nexo.com.br',
    userName: 'Carlos Oliveira',
    department: 'Financeiro',
    status: 'com_agente',
    messages: [
      {
        id: 'm5',
        sender: 'user',
        text: 'Como faço para configurar o e-mail no meu celular?',
        timestamp: '15:10'
      },
      {
        id: 'm6',
        sender: 'agent',
        text: 'Encontrei o artigo na Central de Ajuda: utilize o aplicativo Microsoft Outlook e autentique via Microsoft Authenticator.',
        timestamp: '15:10'
      }
    ]
  }
];

export class ConversationService {
  private static loadSessions(): ConversationSession[] {
    const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(initialMockSessions));
      return initialMockSessions;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialMockSessions;
    }
  }

  private static saveSessions(sessions: ConversationSession[]): void {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }

  public static getAllSessions(): ConversationSession[] {
    return this.loadSessions();
  }

  public static getSessionById(id: string): ConversationSession | undefined {
    return this.loadSessions().find(s => s.id === id);
  }

  public static assumeConversation(sessionId: string): ConversationSession | null {
    const sessions = this.loadSessions();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return null;

    sessions[idx].status = 'em_atendimento';
    sessions[idx].messages.push({
      id: `msg-${Date.now()}`,
      sender: 'analyst',
      text: 'Olá! Sou o analista de suporte N1 e assumi o seu atendimento. Como posso te ajudar?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.saveSessions(sessions);
    return sessions[idx];
  }

  public static returnToAgent(sessionId: string): ConversationSession | null {
    const sessions = this.loadSessions();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return null;

    sessions[idx].status = 'com_agente';
    sessions[idx].messages.push({
      id: `msg-${Date.now()}`,
      sender: 'agent',
      text: 'O analista devolveu a conversa para o Nexo Assist. Estou à disposição caso precise de mais algo!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.saveSessions(sessions);
    return sessions[idx];
  }

  public static closeConversation(sessionId: string): ConversationSession | null {
    const sessions = this.loadSessions();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return null;

    sessions[idx].status = 'encerrada';
    sessions[idx].messages.push({
      id: `msg-${Date.now()}`,
      sender: 'analyst',
      text: 'Atendimento finalizado com sucesso pelo analista.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.saveSessions(sessions);
    return sessions[idx];
  }

  public static sendAnalystMessage(sessionId: string, text: string): ConversationSession | null {
    const sessions = this.loadSessions();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return null;

    sessions[idx].messages.push({
      id: `msg-${Date.now()}`,
      sender: 'analyst',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.saveSessions(sessions);
    return sessions[idx];
  }
}
