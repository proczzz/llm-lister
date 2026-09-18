import type { ProviderAdapter, ModelInfo } from '../types';

const DEEPSEEK_MODELS_URL = 'https://api.deepseek.com/models';

interface DeepSeekModelsResponse {
  data: { id: string }[];
}

function isDeepSeekModelsResponse(body: unknown): body is DeepSeekModelsResponse {
  if (typeof body !== 'object' || body === null || !('data' in body)) return false;
  const data = (body as { data: unknown }).data;
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) => typeof item === 'object' && item !== null && typeof (item as { id: unknown }).id === 'string',
  );
}

export const deepSeekAdapter: ProviderAdapter = {
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(DEEPSEEK_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) {
      throw new Error(`Failed to list DeepSeek models: ${response.status} ${response.statusText}`);
    }
    const body: unknown = await response.json();
    if (!isDeepSeekModelsResponse(body)) {
      throw new Error('Unexpected response shape from DeepSeek /models endpoint');
    }
    return body.data.map((model) => ({ id: model.id, provider: 'deepseek' }));
  },
};
