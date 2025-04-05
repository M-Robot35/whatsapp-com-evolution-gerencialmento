import { useEffect, useState } from 'react';
import WebhookService from '../core/services/webhook-service';

export const useWebhook = (instanceUrl: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webhookService = WebhookService.getInstance();

  useEffect(() => {
    try {
      webhookService.connect(instanceUrl);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar ao webhook');
      setIsConnected(false);
    }

    // Cleanup function
    return () => {
      webhookService.disconnect();
      setIsConnected(false);
    };
  }, [instanceUrl]);

  return {
    isConnected,
    error,
    disconnect: () => {
      webhookService.disconnect();
      setIsConnected(false);
    }
  };
}; 