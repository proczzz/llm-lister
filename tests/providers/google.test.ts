import { afterEach, describe, expect, it, vi } from 'vitest';
import { googleAdapter } from '../../src/providers/google';
import modelsFixture from '../fixtures/google-models.json';

describe('googleAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a real /v1beta/openai/models response and strips the "models/" prefix', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => modelsFixture,
      }),
    );

    const models = await googleAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'gemini-2.5-flash', provider: 'google' },
      { id: 'gemini-2.5-pro', provider: 'google' },
      { id: 'gemma-4-26b-a4b-it', provider: 'google' },
    ]);
  });
});
