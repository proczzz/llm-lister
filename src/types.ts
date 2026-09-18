export type Provider = 'deepseek' | 'anthropic';

export interface ModelInfo {
  id: string;
  provider: Provider;
}

export interface ProviderAdapter {
  listModels(apiKey: string): Promise<ModelInfo[]>;
}
