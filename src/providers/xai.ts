import type { ModelInfo, ProviderAdapter } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const XAI_MODELS_URL = 'https://api.x.ai/v1/models';

export const xaiAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(XAI_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    assertResponseOk(response, 'xAI');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from xAI /v1/models endpoint');
    }
    return body.data.map((model) => ({ id: model.id, provider: 'xai' }));
  },
};
