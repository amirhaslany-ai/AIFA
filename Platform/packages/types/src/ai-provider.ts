export type ProviderId = string;

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
}

export interface ChatResult {
  providerId: ProviderId;
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export type ProviderStatus = 'healthy' | 'degraded' | 'unavailable';

export interface ProviderHealth {
  providerId: ProviderId;
  status: ProviderStatus;
  checkedAt: string;
}
