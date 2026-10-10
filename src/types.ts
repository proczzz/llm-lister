export type Provider = 'anthropic' | 'deepseek' | 'google' | 'nvidia' | 'openai' | 'openrouter';

export interface ModelInfo {
  id: string;
  provider: Provider;
}

export interface ProviderAdapter {
  listModels(apiKey: string): Promise<ModelInfo[]>;
}
