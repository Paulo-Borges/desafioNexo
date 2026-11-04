import type { TicketPriority } from '../types/ticket';
import type { AgentDecision, AgentActionLog, TicketDraft } from '../types/agent';
import { TicketService, KnowledgeBaseService } from './ticketService';

export interface ConversationState {
  step: 'IDLE' | 'AWAITING_SCOPE' | 'AWAITING_CONFIRMATION';
  pendingDraft?: Partial<TicketDraft>;
  isTransferredToAnalyst: boolean;
  transferReason?: string;
}

export class AgentService {
  /**
   * Processa a mensagem do usuário e retorna a decisão estruturada do Agente
   */
  public static async processMessage(
    userMessage: string,
    userEmail: string,
    state: ConversationState
  ): Promise<{ decision: AgentDecision; nextState: ConversationState }> {
    const text = userMessage.trim().toLowerCase();
    const actions: AgentActionLog[] = [];

    // Se já foi transferido para analista, o agente não deve responder
    if (state.isTransferredToAnalyst) {
      return {
        decision: {
          type: 'TRANSFER_TO_ANALYST',
          replyText: 'A conversa está com o analista do Service Desk. O agente permanecerá em pausa até o término do atendimento.',
          actions: [],
          transferReason: state.transferReason
        },
        nextState: state
      };
    }

    // 1. REGRA: Pedido explícito para falar com analista / humano
    if (
      text.includes('falar com analista') ||
      text.includes('falar com humano') ||
      text.includes('atendente') ||
      text.includes('chamar analista')
    ) {
      actions.push({
        label: 'identificou pedido de transferência',
        details: 'Usuário solicitou atendimento com analista humano explicitamente.',
        confidence: 0.99,
        reasoning: 'Atendimento transferido conforme regra do Service Desk (Anexo A).',
        timestamp: new Date().toISOString()
      });

      return {
        decision: {
          type: 'TRANSFER_TO_ANALYST',
          replyText: 'Compreendo. Estou transferindo o seu atendimento para um de nossos analistas do Service Desk N1/N2. O histórico e resumo da nossa conversa já foram encaminhados.',
          actions,
          transferReason: 'Solicitação direta do funcionário'
        },
        nextState: { ...state, isTransferredToAnalyst: true, transferReason: 'Solicitação direta do funcionário' }
      };
    }

    // 2. REGRA: Escopo (Apenas assuntos de TI - Anexo A)
    const outOfScopeKeywords = ['salário', 'holerite', 'férias', 'reembolso', 'benefício', 'ar condicionado', 'limpeza'];
    if (outOfScopeKeywords.some(kw => text.includes(kw))) {
      actions.push({
        label: 'verificou escopo de TI',
        details: 'Solicitação identificada como assunto corporativo fora do escopo de TI.',
        confidence: 0.95,
        reasoning: 'O Service Desk atende apenas TI. Assuntos de RH, Financeiro e Facilities devem ser redirecionados.',
        timestamp: new Date().toISOString()
      });

      return {
        decision: {
          type: 'OUT_OF_SCOPE',
          replyText: 'Identifiquei que sua solicitação é relacionada a RH/Facilities/Financeiro. O Nexo Assist é exclusivo para suporte de TI. Para assuntos de folha, benefícios ou facilities, por favor utilize o Portal do Colaborador ou abra chamado com o time de RH.',
          actions
        },
        nextState: state
      };
    }

    // 3. FLUXO: Se estávamos aguardando confirmação do rascunho de chamado
    if (state.step === 'AWAITING_CONFIRMATION' && state.pendingDraft) {
      if (text.includes('confirmar') || text.includes('sim') || text.includes('pode abrir') || text.includes('abrir chamado')) {
        const draft = state.pendingDraft as TicketDraft;
        const newTicket = TicketService.createTicket({
          title: draft.title,
          description: draft.description,
          type: draft.type,
          category: draft.category,
          priority: draft.priority,
          affectedUserEmail: userEmail,
          affectedUserName: userEmail.split('@')[0],
          affectedScope: draft.scope
        });

        actions.push({
          label: 'abriu chamado no sistema',
          details: `Chamado ${newTicket.id} criado com sucesso.`,
          confidence: 1.0,
          reasoning: 'Dados confirmados pelo funcionário. Chamado registrado com prazo e categoria validados.',
          timestamp: new Date().toISOString()
        });

        return {
          decision: {
            type: 'TICKET_CREATED',
            replyText: `Pronto! Seu chamado **${newTicket.id}** foi aberto com sucesso. A equipe técnica já foi notificada. Prazo estipulado: **${draft.deadlineText}**.`,
            actions,
            tickets: [newTicket]
          },
          nextState: { step: 'IDLE', isTransferredToAnalyst: false }
        };
      } else if (text.includes('cancelar') || text.includes('não') || text.includes('desistir')) {
        return {
          decision: {
            type: 'ANSWER_QUESTION',
            replyText: 'Abertura de chamado cancelada. Se precisar de mais alguma coisa, estou por aqui!',
            actions: [
              {
                label: 'cancelou rascunho',
                details: 'Usuário optou por não criar o chamado.',
                confidence: 0.95,
                reasoning: 'Ação abortada por escolha do usuário.',
                timestamp: new Date().toISOString()
              }
            ]
          },
          nextState: { step: 'IDLE', isTransferredToAnalyst: false }
        };
      }
    }

    // 4. FLUXO: Se estávamos aguardando o escopo / impacto (ex: "Só eu", "Minha equipe")
    if (state.step === 'AWAITING_SCOPE' && state.pendingDraft) {
      let scope: 'individual' | 'equipe' | 'empresa' = 'individual';
      let priority: TicketPriority = 'Média';
      let deadline = '3 dias úteis';

      if (text.includes('empresa') || text.includes('toda a empresa') || text.includes('todos')) {
        scope = 'empresa';
        priority = 'Crítica';
        deadline = '1 hora (Plantão 24h)';
      } else if (text.includes('equipe') || text.includes('time') || text.includes('minha equipe')) {
        scope = 'equipe';
        priority = 'Alta';
        deadline = '4 horas úteis';
      } else if (text.includes('só eu') || text.includes('so eu') || text.includes('apenas eu') || text.includes('individual')) {
        scope = 'individual';
        // Se houver urgência expressa como reunião ou compromisso no dia:
        if (text.includes('urgente') || text.includes('reunião') || text.includes('reuniao') || text.includes('hoje') || text.includes('cliente')) {
          priority = 'Alta';
          deadline = '4 horas úteis';
        } else {
          priority = 'Média';
          deadline = '3 dias úteis';
        }
      }

      actions.push({
        label: 'classificou a prioridade',
        details: `Impacto: ${scope.toUpperCase()} | Prioridade calculada: ${priority} (${deadline})`,
        confidence: 0.95,
        reasoning: 'Combinação de impacto e urgência conforme a tabela de prioridades do Anexo A.',
        timestamp: new Date().toISOString()
      });

      const draft: TicketDraft = {
        title: state.pendingDraft.title || 'Falha de conectividade / VPN',
        description: state.pendingDraft.description || 'Problema relatado no atendimento.',
        type: state.pendingDraft.type || 'INC',
        category: state.pendingDraft.category || 'Rede e VPN',
        priority,
        scope,
        deadlineText: deadline
      };

      return {
        decision: {
          type: 'CONFIRM_DRAFT',
          replyText: `Entendido. Preparei o rascunho do seu chamado. Por favor, confira os dados abaixo antes de confirmar a abertura:`,
          actions,
          draft,
          options: ['Confirmar abertura', 'Cancelar']
        },
        nextState: { step: 'AWAITING_CONFIRMATION', pendingDraft: draft, isTransferredToAnalyst: false }
      };
    }

    // 5. REGRA: Consulta de Chamados Existentes do Usuário
    if (
      text.includes('meus chamados') ||
      text.includes('como está meu chamado') ||
      text.includes('consultar chamado') ||
      text.includes('status do chamado') ||
      text.includes('chamado aberto')
    ) {
      actions.push({
        label: 'consultou seus chamados',
        details: `Busca no serviço de chamados para o funcionário ${userEmail}`,
        confidence: 0.98,
        reasoning: 'Usuário solicitou status de chamados. Apenas chamados de sua autoria são retornados para proteger a privacidade.',
        timestamp: new Date().toISOString()
      });

      const userTickets = TicketService.getTicketsByUser(userEmail);
      const hasOverdue = userTickets.some(t => t.isOverdue && t.status !== 'Resolvido');

      let reply = `Encontrei **${userTickets.length} chamados** registrados no seu usuário.`;
      if (hasOverdue) {
        reply += `\n\n⚠️ Atenção: você possui chamado com prazo estipulado vencido! Deseja que eu transfira para um analista priorizar?`;
      }

      return {
        decision: {
          type: 'LIST_TICKETS',
          replyText: reply,
          actions,
          tickets: userTickets,
          options: hasOverdue ? ['Falar com um analista', 'Ver detalhes'] : undefined
        },
        nextState: state
      };
    }

    // 6. REGRA: Consulta na Central de Ajuda + Triagem Inteligente
    actions.push({
      label: 'consultou seus chamados',
      details: 'Verificando se já existe chamado em aberto sobre o mesmo tema (evitar duplicidade)',
      confidence: 0.95,
      reasoning: 'Garantir que não criaremos chamado duplicado para a mesma falha.',
      timestamp: new Date().toISOString()
    });

    const userTickets = TicketService.getTicketsByUser(userEmail);
    const existingVpnTicket = userTickets.find(t => t.title.toLowerCase().includes('vpn') && t.status !== 'Resolvido');

    actions.push({
      label: 'buscou na central de ajuda',
      details: `Pesquisando artigos relevantes para os termos da mensagem`,
      confidence: 0.92,
      reasoning: 'Verificar se existe solução de autoatendimento antes de gerar carga no Service Desk.',
      timestamp: new Date().toISOString()
    });

    const matchedArticles = KnowledgeBaseService.search(text);

    // Caso de VPN / Erro 809 (Exemplo clássico do Anexo B e do protótipo)
    if (text.includes('vpn') || text.includes('809')) {
      if (existingVpnTicket) {
        return {
          decision: {
            type: 'LIST_TICKETS',
            replyText: `Identifiquei que você já possui o chamado em aberto **${existingVpnTicket.id}** sobre este assunto. Em vez de duplicar, podemos adicionar um complemento com suas novas informações.`,
            actions,
            tickets: [existingVpnTicket],
            options: ['Adicionar informação ao chamado', 'Falar com analista']
          },
          nextState: state
        };
      }

      return {
        decision: {
          type: 'ASK_CLARIFICATION',
          replyText: 'Não há chamado aberto sobre VPN, e o artigo da Central sobre o erro 809 é válido apenas para o Windows 10 (no Windows 11 é necessária configuração da TI). Vou abrir um chamado para você.\n\n**Quem está sendo afetado?**',
          actions,
          options: ['Só eu', 'Minha equipe', 'Toda a empresa', 'Não sei']
        },
        nextState: {
          step: 'AWAITING_SCOPE',
          pendingDraft: {
            title: 'Erro 809 ao conectar VPN',
            description: userMessage,
            type: 'INC',
            category: 'Rede e VPN'
          },
          isTransferredToAnalyst: false
        }
      };
    }

    // Caso de Solicitação de Monitor / Periférico (Requisição REQ)
    if (text.includes('monitor') || text.includes('teclado') || text.includes('mouse') || text.includes('equipamento')) {
      return {
        decision: {
          type: 'ASK_CLARIFICATION',
          replyText: 'Para solicitação de novos equipamentos, abrimos uma Requisição (REQ). Você precisa desse equipamento com urgência para cumprir algum prazo hoje?',
          actions,
          options: ['Sim, compromisso hoje', 'Não, pedido normal']
        },
        nextState: {
          step: 'AWAITING_SCOPE',
          pendingDraft: {
            title: 'Solicitação de Periférico / Equipamento',
            description: userMessage,
            type: 'REQ',
            category: 'Hardware'
          },
          isTransferredToAnalyst: false
        }
      };
    }

    // Resposta padrão usando artigos encontrados na base
    if (matchedArticles.length > 0) {
      const bestArticle = matchedArticles[0];
      return {
        decision: {
          type: 'ANSWER_QUESTION',
          replyText: `Encontrei um artigo na nossa Central de Ajuda que pode te ajudar:\n\n**${bestArticle.title}**\n\n${bestArticle.content}\n\nIsso resolveu a sua dúvida ou você gostaria de abrir um chamado?`,
          actions,
          options: ['Resolveu, obrigado!', 'Quero abrir chamado', 'Falar com analista']
        },
        nextState: state
      };
    }

    // Caso genérico que não encaixou em nenhuma regra específica
    return {
      decision: {
        type: 'ASK_CLARIFICATION',
        replyText: 'Não encontrei uma solução automática na Central de Ajuda. Para que eu possa te ajudar ou abrir um chamado corretamente, você poderia descrever um pouco mais o que está acontecendo?',
        actions: [
          {
            label: 'analisou a mensagem',
            details: 'Dúvida genérica sem artigo correspondente direto.',
            confidence: 0.7,
            reasoning: 'Solicitar mais informações ao usuário antes de tomar uma decisão precipitada.',
            timestamp: new Date().toISOString()
          }
        ]
      },
      nextState: state
    };
  }
}
