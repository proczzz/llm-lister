import type { ProviderAdapter, ModelInfo } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const OPENAI_MODELS_URL = 'https://api.openai.com/v1/models';

export const openAIAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(OPENAI_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    assertResponseOk(response, 'OpenAI');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from OpenAI /v1/models endpoint');
    }
    return body.data.map((model) => ({ id: model.id, provider: 'openai' }));
  },
};
