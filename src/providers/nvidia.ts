import type { ModelInfo, ProviderAdapter } from '../types';
import { assertResponseOk, isModelsResponse } from '../validators';

const NVIDIA_MODELS_URL = 'https://integrate.api.nvidia.com/v1/models';

export const nvidiaAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(NVIDIA_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    assertResponseOk(response, 'NVIDIA');
    const body: unknown = await response.json();
    if (!isModelsResponse(body)) {
      throw new Error('Unexpected response shape from NVIDIA /v1/models endpoint');
    }
    // Ids are vendor-namespaced (e.g. "meta/llama-3.3-70b-instruct"); the prefix
    // is part of the id the inference endpoint expects, so it is kept as-is.
    return body.data.map((model) => ({ id: model.id, provider: 'nvidia' }));
  },
};
