import type { Ticket, TicketPriority, TicketType, TicketCategory, KnowledgeArticle } from '../types/ticket';
import { initialMockTickets, mockArticles } from '../data/mockData';

const TICKETS_STORAGE_KEY = 'nexo_tickets_storage';

export class TicketService {
  private static loadTickets(): Ticket[] {
    const data = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(initialMockTickets));
      return initialMockTickets;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialMockTickets;
    }
  }

  private static saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  }

  /**
   * Retorna os chamados do usuário logado (respeitando a regra de privacidade do PRD)
   */
  public static getTicketsByUser(userEmail: string): Ticket[] {
    const tickets = this.loadTickets();
    return tickets.filter(t => t.affectedUserEmail.toLowerCase() === userEmail.toLowerCase());
  }

  /**
   * Retorna todos os chamados (para o analista de suporte)
   */
  public static getAllTickets(): Ticket[] {
    return this.loadTickets();
  }

  /**
   * Busca um chamado por ID ou número
   */
  public static getTicketById(id: string): Ticket | undefined {
    const tickets = this.loadTickets();
    return tickets.find(t => t.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Calcula o prazo em horas com base na prioridade estipulada no PRD:
   * Crítica: 1 hora
   * Alta: 4 horas úteis (4h)
   * Média: 3 dias úteis (72h)
   * Baixa: 5 dias úteis (120h)
   */
  public static getDeadlineHoursByPriority(priority: TicketPriority): number {
    switch (priority) {
      case 'Crítica': return 1;
      case 'Alta': return 4;
      case 'Média': return 72;
      case 'Baixa': return 120;
      default: return 72;
    }
  }

  /**
   * Cria um novo chamado
   */
  public static createTicket(data: {
    title: string;
    description: string;
    type: TicketType;
    category: TicketCategory;
    priority: TicketPriority;
    affectedUserEmail: string;
    affectedUserName: string;
    affectedScope: 'individual' | 'equipe' | 'empresa';
  }): Ticket {
    const tickets = this.loadTickets();
    const count = tickets.length + 1;
    const prefix = data.type === 'INC' ? 'INC' : 'REQ';
    const id = `${prefix}-${20300 + count}`;
    const deadlineHours = this.getDeadlineHoursByPriority(data.priority);

    const newTicket: Ticket = {
      ...data,
      id,
      status: 'Aberto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadlineHours,
      isOverdue: false,
      updates: [
        {
          author: 'Nexo Assist',
          text: 'Chamado aberto via atendimento virtual.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    tickets.unshift(newTicket);
    this.saveTickets(tickets);
    return newTicket;
  }

  /**
   * Adiciona atualização/complemento em um chamado existente
   */
  public static addUpdateToTicket(ticketId: string, author: string, updateText: string): Ticket | null {
    const tickets = this.loadTickets();
    const index = tickets.findIndex(t => t.id.toLowerCase() === ticketId.toLowerCase());
    if (index === -1) return null;

    const ticket = tickets[index];
    ticket.updatedAt = new Date().toISOString();
    ticket.updates.push({
      author,
      text: updateText,
      timestamp: new Date().toISOString()
    });

    tickets[index] = ticket;
    this.saveTickets(tickets);
    return ticket;
  }

  /**
   * Atualiza status do chamado
   */
  public static updateTicketStatus(ticketId: string, status: Ticket['status']): Ticket | null {
    const tickets = this.loadTickets();
    const index = tickets.findIndex(t => t.id.toLowerCase() === ticketId.toLowerCase());
    if (index === -1) return null;

    tickets[index].status = status;
    tickets[index].updatedAt = new Date().toISOString();
    this.saveTickets(tickets);
    return tickets[index];
  }
}

export class KnowledgeBaseService {
  /**
   * Busca artigos na central de ajuda por termos de busca
   */
  public static search(query: string): KnowledgeArticle[] {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return mockArticles;

    return mockArticles.filter(art => {
      const matchTitle = art.title.toLowerCase().includes(cleanQuery);
      const matchContent = art.content.toLowerCase().includes(cleanQuery);
      const matchTags = art.tags.some(tag => tag.toLowerCase().includes(cleanQuery));
      return matchTitle || matchContent || matchTags;
    });
  }
}
