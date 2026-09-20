import { anthropicAdapter } from './providers/anthropic';
import { deepSeekAdapter } from './providers/deepseek';
import { geminiAdapter } from './providers/gemini';
import { openAIAdapter } from './providers/openai';
import type { ModelInfo, Provider, ProviderAdapter } from './types';

export type { ModelInfo, Provider };

const adapters: Record<Provider, ProviderAdapter> = {
  anthropic: anthropicAdapter,
  deepseek: deepSeekAdapter,
  gemini: geminiAdapter,
  openai: openAIAdapter,
};

export async function listModels(provider: Provider, apiKey: string): Promise<ModelInfo[]> {
  const adapter = adapters[provider];
  if (!adapter) {
    throw new Error(`Unsupported provider: "${provider}"`);
  }
  return adapter.listModels(apiKey);
}

export function getSupportedProviders(): Provider[] {
  return Object.keys(adapters) as Provider[];
}
