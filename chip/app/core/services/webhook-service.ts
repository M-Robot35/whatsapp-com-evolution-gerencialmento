import { WebSocket } from 'ws';

class WebhookService {
  private static instance: WebhookService;
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 5000; // 5 segundos

  private constructor() {}

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  public connect(instanceUrl: string): void {
    if (this.isConnected) {
      console.log('Webhook já está conectado');
      return;
    }

    try {
      this.ws = new WebSocket(instanceUrl);
      this.setupEventListeners();
      this.isConnected = true;
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('Erro ao conectar ao webhook:', error);
      this.handleReconnect(instanceUrl);
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.on('open', () => {
      console.log('Webhook conectado com sucesso');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    });

    this.ws.on('close', () => {
      console.log('Webhook desconectado');
      this.isConnected = false;
    });

    this.ws.on('error', (error) => {
      console.error('Erro no webhook:', error);
      this.isConnected = false;
    });
  }

  private handleMessage(message: any): void {
    // Aqui você pode implementar a lógica para processar as mensagens recebidas
    console.log('Mensagem recebida:', message);
    
    // Exemplo de processamento de diferentes tipos de mensagens
    switch (message.type) {
      case 'status':
        console.log('Status da instância:', message.data);
        break;
      case 'message':
        console.log('Nova mensagem:', message.data);
        break;
      case 'error':
        console.error('Erro da instância:', message.data);
        break;
      default:
        console.log('Mensagem não processada:', message);
    }
  }

  private handleReconnect(instanceUrl: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Número máximo de tentativas de reconexão atingido');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Tentando reconectar... Tentativa ${this.reconnectAttempts}`);

    setTimeout(() => {
      this.connect(instanceUrl);
    }, this.reconnectTimeout);
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
    }
  }

  public isWebhookConnected(): boolean {
    return this.isConnected;
  }
}

export default WebhookService; 