import { afterEach, describe, expect, it, vi } from 'vitest';
import { nvidiaAdapter } from '../../src/providers/nvidia';
import modelsFixture from '../fixtures/nvidia-models.json';

describe('nvidiaAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a real /v1/models response and keeps the vendor prefix in the id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => modelsFixture,
      }),
    );

    const models = await nvidiaAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: '01-ai/yi-large', provider: 'nvidia' },
      { id: 'bigcode/starcoder2-15b', provider: 'nvidia' },
      { id: 'deepseek-ai/deepseek-v4.1-flash', provider: 'nvidia' },
      { id: 'google/codegemma-7b', provider: 'nvidia' },
    ]);
  });
});
