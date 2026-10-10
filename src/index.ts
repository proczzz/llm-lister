import { anthropicAdapter } from './providers/anthropic';
import { deepSeekAdapter } from './providers/deepseek';
import { googleAdapter } from './providers/google';
import { nvidiaAdapter } from './providers/nvidia';
import { openAIAdapter } from './providers/openai';
import { openRouterAdapter } from './providers/openrouter';
import type { ModelInfo, Provider, ProviderAdapter } from './types';

export type { ModelInfo, Provider };

const adapters: Record<Provider, ProviderAdapter> = {
  anthropic: anthropicAdapter,
  deepseek: deepSeekAdapter,
  google: googleAdapter,
  nvidia: nvidiaAdapter,
  openai: openAIAdapter,
  openrouter: openRouterAdapter,
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
