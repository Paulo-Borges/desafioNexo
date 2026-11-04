export type TicketType = 'INC' | 'REQ';

export type TicketCategory = 'Acesso' | 'Rede e VPN' | 'Hardware' | 'Software' | 'E-mail' | 'Outros';

export type TicketPriority = 'Crítica' | 'Alta' | 'Média' | 'Baixa';

export type TicketStatus = 'Aberto' | 'Em andamento' | 'Aguardando analista' | 'Aguardando usuário' | 'Resolvido' | 'Cancelado';

export interface Ticket {
  id: string; // Ex: INC-20311, REQ-10442
  title: string;
  description: string;
  type: TicketType;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  affectedUserEmail: string;
  affectedUserName: string;
  affectedScope: 'individual' | 'equipe' | 'empresa';
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  deadlineHours: number; // Prazo conforme prioridade
  isOverdue?: boolean; // Se ultrapassou o prazo
  updates: Array<{
    author: string;
    text: string;
    timestamp: string;
  }>;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: TicketCategory;
  tags: string[];
  content: string;
  appliesToOS?: 'Windows 10' | 'Windows 11' | 'macOS' | 'Linux' | 'Todos';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'funcionario' | 'analista';
  department: string;
}
