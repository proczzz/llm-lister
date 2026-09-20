import type { ModelInfo, ProviderAdapter } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const OPENAI_MODELS_URL = 'https://api.openai.com/v1/models';

// OpenAI reports a `shutdown_date` per model; models past it are no longer usable.
function isShutDown(model: { id: string }, now: number): boolean {
  const shutdownDate = (model as { shutdown_date?: unknown }).shutdown_date;
  return typeof shutdownDate === 'string' && Date.parse(shutdownDate) <= now;
}

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
    const now = Date.now();
    return body.data
      .filter((model) => !isShutDown(model, now))
      .map((model) => ({ id: model.id, provider: 'openai' }));
  },
};
