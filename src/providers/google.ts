import type { ModelInfo, ProviderAdapter } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const GOOGLE_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/models';

export const googleAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(GOOGLE_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    assertResponseOk(response, 'Google');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from Google /v1beta/openai/models endpoint');
    }
    return body.data.map((model) => ({
      id: model.id.replace(/^models\//, ''),
      provider: 'google',
    }));
  },
};
