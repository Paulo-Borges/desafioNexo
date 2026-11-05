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
  initials: string;
  avatarBg?: string;
  avatarColor?: string;
  status: 'com_agente' | 'aguardando_analista' | 'em_atendimento' | 'encerrada';
  category?: 'para_voce' | 'com_agente' | 'minhas';
  unreadCount?: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  badgeText?: string;
  badgeType?: 'transferida' | 'agent_atendendo' | 'resolvida' | 'pediu_ajuda' | 'digitando';
  transferredAt?: string;
  transferReason?: string;
  messages: ChatMessageItem[];
  relatedTicketId?: string;
  isOnline?: boolean;
}

const SESSIONS_STORAGE_KEY = 'nexo_chat_sessions_storage_v2';

export const initialMockSessions: ConversationSession[] = [
  {
    id: 'conv-101',
    userEmail: 'ana.souza@nexo.com.br',
    userName: 'Ana Souza',
    department: 'Financeiro',
    initials: 'AS',
    avatarBg: 'bg-blue-100',
    avatarColor: 'text-blue-700',
    status: 'aguardando_analista',
    category: 'para_voce',
    unreadCount: 2,
    lastMessageSnippet: 'Está parado há 5 dias. Quero falar com...',
    lastMessageTime: '10:05',
    badgeText: 'Transferida · INC-20311',
    badgeType: 'transferida',
    transferredAt: '10:05',
    transferReason: 'Chamado INC-20311 sem atualização há 5 dias, acima do prazo de 3 dias úteis.',
    relatedTicketId: 'INC-20311',
    isOnline: true,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Qual o status do meu chamado?',
        timestamp: '10:01'
      },
      {
        id: 'm2',
        sender: 'agent',
        text: 'Você tem 3 chamados abertos. Sobre qual deles quer saber?',
        timestamp: '10:01'
      },
      {
        id: 'm3',
        sender: 'user',
        text: 'INC-20311 · Notebook lento após atualização',
        timestamp: '10:02'
      },
      {
        id: 'm4',
        sender: 'agent',
        text: 'Está sem atualização há 5 dias, acima do prazo de 3 dias úteis. Quer que eu chame um analista?',
        timestamp: '10:02'
      },
      {
        id: 'm5',
        sender: 'user',
        text: 'Está parado há 5 dias.',
        timestamp: '10:04'
      },
      {
        id: 'm6',
        sender: 'user',
        text: 'Quero falar com um analista.',
        timestamp: '10:04'
      },
      {
        id: 'm7',
        sender: 'agent',
        text: 'Encaminhei para o Suporte N2. Um analista vai falar com você em até 2 h úteis.',
        timestamp: '10:05'
      }
    ]
  },
  {
    id: 'conv-102',
    userEmail: 'carla.mendes@nexo.com.br',
    userName: 'Carla Mendes',
    department: 'Operações',
    initials: 'CM',
    avatarBg: 'bg-orange-100',
    avatarColor: 'text-orange-700',
    status: 'aguardando_analista',
    category: 'para_voce',
    unreadCount: 1,
    lastMessageSnippet: 'Preciso de acesso ao SAP ainda hoje',
    lastMessageTime: '09:58',
    badgeText: 'Transferida · contato em 25 min',
    badgeType: 'transferida',
    transferReason: 'Acesso bloqueado em sistema crítico de faturamento.',
    messages: [
      {
        id: 'cm1',
        sender: 'user',
        text: 'Preciso de acesso ao SAP ainda hoje para fechar o faturamento.',
        timestamp: '09:58'
      }
    ]
  },
  {
    id: 'conv-103',
    userEmail: 'bruno.tavares@nexo.com.br',
    userName: 'Bruno Tavares',
    department: 'Comercial',
    initials: 'BT',
    avatarBg: 'bg-purple-100',
    avatarColor: 'text-purple-700',
    status: 'aguardando_analista',
    category: 'para_voce',
    lastMessageSnippet: 'Nexo: Vou chamar um analista para isso.',
    lastMessageTime: '09:51',
    badgeText: 'Agent pediu ajuda · confiança 41%',
    badgeType: 'pediu_ajuda',
    transferReason: 'Dúvida complexa sobre VPN com baixa confiança da IA (41%).',
    messages: [
      {
        id: 'bt1',
        sender: 'user',
        text: 'A VPN desconecta toda vez que abro a planilha compartilhada.',
        timestamp: '09:50'
      },
      {
        id: 'bt2',
        sender: 'agent',
        text: 'Vou chamar um analista para isso.',
        timestamp: '09:51'
      }
    ]
  },
  {
    id: 'conv-104',
    userEmail: 'diego.ramos@nexo.com.br',
    userName: 'Diego Ramos',
    department: 'RH',
    initials: 'DR',
    avatarBg: 'bg-green-100',
    avatarColor: 'text-green-700',
    status: 'com_agente',
    category: 'com_agente',
    lastMessageSnippet: 'digitando...',
    lastMessageTime: 'agora',
    badgeText: 'Agent atendendo',
    badgeType: 'digitando',
    messages: [
      {
        id: 'dr1',
        sender: 'user',
        text: 'Como solicito crachá novo?',
        timestamp: '10:00'
      }
    ]
  },
  {
    id: 'conv-105',
    userEmail: 'elisa.prado@nexo.com.br',
    userName: 'Elisa Prado',
    department: 'Marketing',
    initials: 'EP',
    avatarBg: 'bg-pink-100',
    avatarColor: 'text-pink-700',
    status: 'com_agente',
    category: 'com_agente',
    lastMessageSnippet: 'Nexo: Chamado INC-20519 criado.',
    lastMessageTime: '10:03',
    badgeText: 'Agent atendendo',
    badgeType: 'agent_atendendo',
    messages: [
      {
        id: 'ep1',
        sender: 'user',
        text: 'Meu Figma não carrega as fontes.',
        timestamp: '10:02'
      },
      {
        id: 'ep2',
        sender: 'agent',
        text: 'Chamado INC-20519 criado com sucesso para o time de TI.',
        timestamp: '10:03'
      }
    ]
  },
  {
    id: 'conv-106',
    userEmail: 'fabio.nunes@nexo.com.br',
    userName: 'Fábio Nunes',
    department: 'Logística',
    initials: 'FN',
    avatarBg: 'bg-gray-100',
    avatarColor: 'text-gray-700',
    status: 'encerrada',
    category: 'com_agente',
    lastMessageSnippet: 'Isso resolveu, obrigado!',
    lastMessageTime: '10:01',
    badgeText: 'Resolvida pelo agent',
    badgeType: 'resolvida',
    messages: [
      {
        id: 'fn1',
        sender: 'agent',
        text: 'Basta reiniciar o roteador e aguardar 30 segundos.',
        timestamp: '10:00'
      },
      {
        id: 'fn2',
        sender: 'user',
        text: 'Isso resolveu, obrigado!',
        timestamp: '10:01'
      }
    ]
  },
  {
    id: 'conv-107',
    userEmail: 'gabriela.rocha@nexo.com.br',
    userName: 'Gabriela Rocha',
    department: 'Jurídico',
    initials: 'GR',
    avatarBg: 'bg-amber-100',
    avatarColor: 'text-amber-700',
    status: 'encerrada',
    category: 'com_agente',
    lastMessageSnippet: 'Nexo: A senha do Wi-Fi foi enviada...',
    lastMessageTime: 'ontem',
    badgeText: 'Resolvida pelo agent',
    badgeType: 'resolvida',
    messages: [
      {
        id: 'gr1',
        sender: 'agent',
        text: 'A senha do Wi-Fi corporativo foi enviada para seu e-mail cadastrado.',
        timestamp: 'ontem'
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
    sessions[idx].category = 'minhas';
    sessions[idx].messages.push({
      id: `msg-${Date.now()}`,
      sender: 'analyst',
      text: 'Olá! Sou o analista de suporte N1 e assumi o seu atendimento. Como posso ajudar você hoje?',
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
    sessions[idx].category = 'com_agente';
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

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sessions[idx].messages.push({
      id: `msg-${Date.now()}`,
      sender: 'analyst',
      text,
      timestamp: time
    });
    sessions[idx].lastMessageSnippet = text;
    sessions[idx].lastMessageTime = time;

    this.saveSessions(sessions);
    return sessions[idx];
  }
}
