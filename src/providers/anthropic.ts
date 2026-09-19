import type { ProviderAdapter, ModelInfo } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const ANTHROPIC_MODELS_URL = 'https://api.anthropic.com/v1/models';
const ANTHROPIC_API_VERSION = '2023-06-01';

export const anthropicAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(ANTHROPIC_MODELS_URL, {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_API_VERSION,
      },
    });
    assertResponseOk(response, 'Anthropic');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from Anthropic /v1/models endpoint');
    }
    return body.data.map((model) => ({ id: model.id, provider: 'anthropic' }));
  },
};
