import { afterEach, describe, expect, it, vi } from 'vitest';
import { anthropicAdapter } from '../../src/providers/anthropic';
import modelsFixture from '../fixtures/anthropic-models.json';

describe('anthropicAdapter.listModels', () => {
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

    const models = await anthropicAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'claude-fable-5-1', provider: 'anthropic' },
      { id: 'claude-opus-5', provider: 'anthropic' },
      { id: 'claude-sonnet-5', provider: 'anthropic' },
    ]);
  });
});
