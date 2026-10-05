export type Provider = 'anthropic' | 'deepseek' | 'google' | 'nvidia' | 'openai';

export interface ModelInfo {
  id: string;
  provider: Provider;
}

export interface ProviderAdapter {
  listModels(apiKey: string): Promise<ModelInfo[]>;
}
