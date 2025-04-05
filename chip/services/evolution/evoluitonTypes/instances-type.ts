export type IEvolutionInstance = {
    id: string;
    name: string;
    connectionStatus: string//'open' | 'closed' | 'connecting'; // Dependendo dos possíveis valores
    ownerJid: string;
    profileName: string;
    profilePicUrl: string;
    integration: string; // 'WHATSAPP-BAILEYS' | Caso haja mais integrações no futuro
    number: string | null;
    businessId: string | null;
    token: string;
    clientName: string;
    disconnectionReasonCode: string | null;
    disconnectionObject: any | null; // Pode ser melhor definido se houver uma estrutura clara
    disconnectionAt: string | null;
    createdAt: string;
    updatedAt: string;
    Chatwoot: any | null;
    Proxy: any | null;
    Rabbitmq: any | null;
    Sqs: any | null;
    Websocket: any | null;
    Setting: IEvolutionSettings;
    _count: {
      Message: number;
      Contact: number;
      Chat: number;
    };
}

export type IEvolutionSettings= {
  id: string;
  rejectCall: boolean;
  msgCall: string;
  groupsIgnore: boolean;
  alwaysOnline: boolean;
  readMessages: boolean;
  readStatus: boolean;
  syncFullHistory: boolean;
  createdAt: string;
  updatedAt: string;
  instanceId: string;
}



export interface ISettings {
	rejectCall: boolean,
  msgCall: string,
  groupsIgnore: boolean,
  alwaysOnline: boolean,
  readMessages: boolean,
  syncFullHistory: boolean,
  readStatus: boolean
}

export interface IWebhookSetOptions {
  enabled:boolean
  url:string
  byEvents:boolean
  base64:boolean
  events: string[]
}

export interface IProxySetOptions {
  enabled:boolean
  host: string,       // "0.0.0.0"
  port: string,       // "8000"
  protocol: string,   // "http"
  username: string,   // "user"
  password:  string   // "pass"
}


export type TypeWebhookOutput =  {
  createdAt: string,
  enabled: boolean,
  events: string[]
  headers: {'Content-Type': string, autorization: string},
  id: string,
  instanceId: string,
  updatedAt: string,
  url: string,
  webhookBase64: boolean
  webhookByEvents: boolean
}

// ____________  GRUPOS  _________________
export type TypeGroupOutput = {
  announce: boolean
  creation: number
  desc: string
  descId: string
  id: string
  owner: string
  pictureUrl: string|null
  restrict: boolean
  size: number
  subject: string
  subjectOwner: string
  subjectTime: number
}


export type TypeGroupParticipants= {
  participants: TypeParticipants[]
}

export type TypeParticipants= {
  id: string,
  admin: string| null,
  name?: string| null,
  imgUrl?: string| null
}

//_________________________________________________

export type InstanciaRestartType ={
  pairingCode: string,
  code: string,
  base64: string,
  count: number
}

//_______________________  eventos webhooks __________________________

export type EventsDispatch= {
  evento: string
  descricao: string
}

export const evolutionEvents:EventsDispatch[] = [
  { evento: "APPLICATION_STARTUP", descricao: "Evento disparado quando a aplicação é iniciada." },
  { evento: "QRCODE_UPDATED", descricao: "Evento acionado quando o QR Code é atualizado." },
  { evento: "MESSAGES_SET", descricao: "Define o conjunto de mensagens recebidas." },
  { evento: "MESSAGES_UPSERT", descricao: "Adiciona novas mensagens ou atualiza existentes." },
  { evento: "MESSAGES_UPDATE", descricao: "Atualiza mensagens já existentes." },
  { evento: "MESSAGES_DELETE", descricao: "Remove mensagens do sistema." },
  { evento: "SEND_MESSAGE", descricao: "Evento disparado ao enviar uma mensagem." },
  { evento: "CONTACTS_SET", descricao: "Define a lista de contatos." },
  { evento: "CONTACTS_UPSERT", descricao: "Adiciona ou atualiza contatos." },
  { evento: "CONTACTS_UPDATE", descricao: "Atualiza informações de contatos." },
  { evento: "PRESENCE_UPDATE", descricao: "Atualiza o status de presença de um contato." },
  { evento: "CHATS_SET", descricao: "Define o conjunto de chats disponíveis." },
  { evento: "CHATS_UPSERT", descricao: "Adiciona ou atualiza chats." },
  { evento: "CHATS_UPDATE", descricao: "Atualiza informações dos chats." },
  { evento: "CHATS_DELETE", descricao: "Remove chats da lista." },
  { evento: "GROUPS_UPSERT", descricao: "Adiciona ou atualiza informações de grupos." },
  { evento: "GROUP_UPDATE", descricao: "Atualiza detalhes de um grupo." },
  { evento: "GROUP_PARTICIPANTS_UPDATE", descricao: "Atualiza os participantes de um grupo." },
  { evento: "CONNECTION_UPDATE", descricao: "Evento disparado quando há mudanças na conexão." },
  { evento: "LABELS_EDIT", descricao: "Edita etiquetas para organização de mensagens e contatos." },
  { evento: "LABELS_ASSOCIATION", descricao: "Associa etiquetas a mensagens ou contatos." },
  { evento: "CALL", descricao: "Evento disparado para chamadas de áudio ou vídeo." },
  { evento: "TYPEBOT_START", descricao: "Inicia o Typebot para automação de respostas." },
  { evento: "TYPEBOT_CHANGE_STATUS", descricao: "Altera o status do Typebot." },
  { evento: "MESSAGES_EDITED", descricao: "Evento acionado quando uma mensagem é editada." },
  { evento: "REMOVE_INSTANCE", descricao: "Remove uma instância ativa do sistema." },
  { evento: "LOGOUT_INSTANCE", descricao: "Efetua o logout de uma instância ativa." }
]


//_______________________  criar instancia __________________________


export type InstanceCreateEvolution ={
  hash: string
  instance: Instance
  qrcode: InstanceQrCode
  settings: typeSettingsInstance
  rabbitmq: null
  sqs: null
  webhook: null
  websocket: null
}

export type typeSettingsInstance= {
  alwaysOnline: boolean
  groupsIgnore: boolean
  msgCall: string
  readMessages: boolean
  readStatus: boolean
  rejectCall: boolean
  syncFullHistory: boolean
}

export type Instance = {
  accessTokenWaBusiness: string
  instanceId: string
  instanceName: string
  integration: string
  status: string
  webhookWaBusiness: null 
}

export type InstanceQrCode= {
  code: string, 
  base64: string, 
  count: number
  pairingCode: null, 
}

