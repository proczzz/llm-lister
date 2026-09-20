import { afterEach, describe, expect, it, vi } from 'vitest';
import { openAIAdapter } from '../../src/providers/openai';
import modelsFixture from '../fixtures/openai-models.json';

describe('openAIAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a real /v1/models response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => modelsFixture,
      }),
    );

    const models = await openAIAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'gpt-4', provider: 'openai' },
      { id: 'gpt-4o-mini', provider: 'openai' },
      { id: 'gpt-5', provider: 'openai' },
      { id: 'gpt-5-pro', provider: 'openai' },
    ]);
  });
});
