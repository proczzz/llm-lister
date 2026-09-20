import type { ModelInfo, ProviderAdapter } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/models';

export const geminiAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(GEMINI_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    assertResponseOk(response, 'Gemini');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from Gemini /v1beta/openai/models endpoint');
    }
    return body.data.map((model) => ({
      id: model.id.replace(/^models\//, ''),
      provider: 'gemini',
    }));
  },
};
