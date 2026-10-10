import type { ModelInfo, ProviderAdapter } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const GROQ_MODELS_URL = 'https://api.groq.com/openai/v1/models';

export const groqAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(GROQ_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    assertResponseOk(response, 'Groq');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from Groq /openai/v1/models endpoint');
    }
    // Ids are reported as-is: some are bare (`whisper-large-v3`), others carry a
    // vendor prefix (`openai/gpt-oss-120b`), and both forms are what the API expects.
    return body.data.map((model) => ({ id: model.id, provider: 'groq' }));
  },
};
