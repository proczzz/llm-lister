import type { ProviderAdapter, ModelInfo } from '../types';

const ANTHROPIC_MODELS_URL = 'https://api.anthropic.com/v1/models';
const ANTHROPIC_API_VERSION = '2023-06-01';

interface AnthropicModelsResponse {
  data: { id: string }[];
}

function isAnthropicModelsResponse(body: unknown): body is AnthropicModelsResponse {
  if (typeof body !== 'object' || body === null || !('data' in body)) return false;
  const data = (body as { data: unknown }).data;
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) => typeof item === 'object' && item !== null && typeof (item as { id: unknown }).id === 'string',
  );
}

export const anthropicAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(ANTHROPIC_MODELS_URL, {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_API_VERSION,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to list Anthropic models: ${response.status} ${response.statusText}`);
    }
    const body: unknown = await response.json();
    if (!isAnthropicModelsResponse(body)) {
      throw new Error('Unexpected response shape from Anthropic /v1/models endpoint');
    }
    return body.data.map((model) => ({ id: model.id, provider: 'anthropic' }));
  },
};
