import { deepSeekAdapter } from './providers/deepseek';
import type { ModelInfo, Provider, ProviderAdapter } from './types';

export type { ModelInfo, Provider };

const adapters: Partial<Record<Provider, ProviderAdapter>> = {
  deepseek: deepSeekAdapter,
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
