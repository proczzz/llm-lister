import type { ModelInfo, ProviderAdapter } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

// OpenRouter also serves an unauthenticated catalog at /api/v1/models. This package
// reports what a key can use, so it queries the account-scoped endpoint instead:
// that one applies the account's provider preferences, privacy settings and guardrails.
const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models/user';

export const openRouterAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(OPENROUTER_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    assertResponseOk(response, 'OpenRouter');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from OpenRouter /api/v1/models/user endpoint');
    }
    // Ids are vendor-namespaced and may carry a variant suffix
    // (e.g. "anthropic/claude-haiku-5.5:batch"); both are part of the id.
    return body.data.map((model) => ({ id: model.id, provider: 'openrouter' }));
  },
};
