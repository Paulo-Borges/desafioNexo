import type { User, KnowledgeArticle, Ticket } from '../types/ticket';

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Borges Silva',
    email: 'borges@nexo.com.br',
    role: 'funcionario',
    department: 'Marketing'
  },
  {
    id: 'usr-2',
    name: 'Mariana Costa',
    email: 'mariana.costa@nexo.com.br',
    role: 'funcionario',
    department: 'Vendas'
  },
  {
    id: 'usr-3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@nexo.com.br',
    role: 'funcionario',
    department: 'Financeiro'
  },
  {
    id: 'usr-analista',
    name: 'Lucas Analista N1',
    email: 'suporte@nexo.com.br',
    role: 'analista',
    department: 'TI Service Desk'
  }
];

export const mockArticles: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'VPN com erro 809',
    category: 'Rede e VPN',
    tags: ['vpn', '809', 'conexão', 'rede'],
    appliesToOS: 'Windows 10',
    content: 'Reinstale o cliente de VPN pelo portal de softwares da empresa e reinicie o computador. ATENÇÃO: Esta solução automatizada é válida apenas para Windows 10. Se estiver no Windows 11, abra um chamado com a equipe de TI.'
  },
  {
    id: 'art-2',
    title: 'Horário de funcionamento do Service Desk de TI',
    category: 'Outros',
    tags: ['horário', 'atendimento', 'suporte', 'plantão', 'service desk'],
    appliesToOS: 'Todos',
    content: 'O Service Desk funciona de segunda a sexta, das 8h às 18h. Chamados com prioridade Crítica (impacto empresa/equipe) contam com plantão 24 horas.'
  },
  {
    id: 'art-3',
    title: 'Como solicitar segundo monitor para Home Office',
    category: 'Hardware',
    tags: ['monitor', 'tela', 'equipamento', 'home office', 'hardware'],
    appliesToOS: 'Todos',
    content: 'A solicitação de periféricos e monitores adicionais é feita como requisição (REQ). Prazo padrão de entrega é de até 5 dias úteis após aprovação da gerência.'
  },
  {
    id: 'art-4',
    title: 'Desbloqueio e redefinição de senha do SAP',
    category: 'Acesso',
    tags: ['sap', 'senha', 'bloqueada', 'login', 'acesso'],
    appliesToOS: 'Todos',
    content: 'Se a sua senha do SAP for bloqueada por excesso de tentativas, aguarde 15 minutos para desbloqueio automático ou abra um chamado de incidente na categoria Acesso.'
  },
  {
    id: 'art-5',
    title: 'Configuração de E-mail no Outlook e Celular',
    category: 'E-mail',
    tags: ['email', 'outlook', 'celular', 'smartphone', 'mfa'],
    appliesToOS: 'Todos',
    content: 'Para acessar o e-mail corporativo em dispositivos móveis, utilize o app Microsoft Outlook e autentique via Microsoft Authenticator com seu e-mail @nexo.com.br.'
  },
  {
    id: 'art-6',
    title: 'Instalação de programas e softwares homologados',
    category: 'Software',
    tags: ['software', 'instalação', 'aplicativos', 'programas'],
    appliesToOS: 'Todos',
    content: 'Softwares comuns (Slack, Zoom, VS Code, Notion) estão disponíveis no Portal de Aplicativos sem necessidade de chamado. Softwares pagos requerem requisição (REQ).'
  }
];

export const initialMockTickets: Ticket[] = [
  {
    id: 'INC-20311',
    title: 'Notebook lento após atualização do Windows',
    description: 'Após o último update do sistema, o consumo de disco fica em 100% e o notebook trava frequentemente.',
    type: 'INC',
    category: 'Hardware',
    priority: 'Média',
    status: 'Aguardando analista',
    affectedUserEmail: 'borges@nexo.com.br',
    affectedUserName: 'Borges Silva',
    affectedScope: 'individual',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // Há 6 dias
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineHours: 72, // 3 dias úteis
    isOverdue: true,
    updates: [
      {
        author: 'Sistema',
        text: 'Chamado aberto automaticamente.',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'REQ-10442',
    title: 'Segundo monitor para home office',
    description: 'Solicitação de monitor HDMI de 24 polegadas para setup de trabalho remoto.',
    type: 'REQ',
    category: 'Hardware',
    priority: 'Baixa',
    status: 'Resolvido',
    affectedUserEmail: 'borges@nexo.com.br',
    affectedUserName: 'Borges Silva',
    affectedScope: 'individual',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Há 1 semana
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineHours: 120, // 5 dias úteis
    isOverdue: false,
    updates: [
      {
        author: 'Lucas Analista N1',
        text: 'Monitor enviado via correios. Código de rastreio: BR123456789.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'INC-20150',
    title: 'Senha do SAP bloqueada',
    description: 'Conta bloqueada após digitação errada da senha temporária.',
    type: 'INC',
    category: 'Acesso',
    priority: 'Média',
    status: 'Resolvido',
    affectedUserEmail: 'borges@nexo.com.br',
    affectedUserName: 'Borges Silva',
    affectedScope: 'individual',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // Há 4 dias
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineHours: 72,
    isOverdue: false,
    updates: [
      {
        author: 'Lucas Analista N1',
        text: 'Senha reiniciada com sucesso e enviada por SMS.',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'INC-20400',
    title: 'Falha na impressora do 3º andar',
    description: 'A impressora do setor financeiro não responde aos comandos na rede.',
    type: 'INC',
    category: 'Hardware',
    priority: 'Média',
    status: 'Aberto',
    affectedUserEmail: 'carlos.oliveira@nexo.com.br',
    affectedUserName: 'Carlos Oliveira',
    affectedScope: 'equipe',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineHours: 72,
    isOverdue: false,
    updates: []
  }
];
