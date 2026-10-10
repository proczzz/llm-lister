import { afterEach, describe, expect, it, vi } from 'vitest';
import { groqAdapter } from '../../src/providers/groq';
import modelsFixture from '../fixtures/groq-models.json';

describe('groqAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a real /openai/v1/models response and keeps ids verbatim', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => modelsFixture,
      }),
    );

    const models = await groqAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'whisper-large-v3', provider: 'groq' },
      { id: 'meta-llama/llama-prompt-guard-2-86m', provider: 'groq' },
      { id: 'openai/gpt-oss-120b', provider: 'groq' },
      { id: 'canopylabs/orpheus-v1-english', provider: 'groq' },
    ]);
  });
});
