export type Provider =
  | 'anthropic'
  | 'deepseek'
  | 'google'
  | 'groq'
  | 'nvidia'
  | 'openai'
  | 'openrouter'
  | 'xai';

export interface ModelInfo {
  id: string;
  provider: Provider;
}

export interface ProviderAdapter {
  listModels(apiKey: string): Promise<ModelInfo[]>;
}
