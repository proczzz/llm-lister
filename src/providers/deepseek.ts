import type { ProviderAdapter, ModelInfo } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const DEEPSEEK_MODELS_URL = 'https://api.deepseek.com/models';

export const deepSeekAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(DEEPSEEK_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    assertResponseOk(response, 'DeepSeek');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from DeepSeek /models endpoint');
    }
    return body.data.map((model) => ({ id: model.id, provider: 'deepseek' }));
  },
};
