import { afterEach, describe, expect, it, vi } from 'vitest';
import { geminiAdapter } from '../../src/providers/gemini';
import modelsFixture from '../fixtures/gemini-models.json';

describe('geminiAdapter.listModels', () => {
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

    const models = await geminiAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'gemini-2.5-flash', provider: 'gemini' },
      { id: 'gemini-2.5-pro', provider: 'gemini' },
      { id: 'gemma-4-26b-a4b-it', provider: 'gemini' },
    ]);
  });
});
