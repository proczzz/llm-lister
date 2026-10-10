import { afterEach, describe, expect, it, vi } from 'vitest';
import { openRouterAdapter } from '../../src/providers/openrouter';
import modelsFixture from '../fixtures/openrouter-models.json';

describe('openRouterAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a real /api/v1/models/user response and keeps ids verbatim', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => modelsFixture,
      }),
    );

    const models = await openRouterAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'stepfun/step-5-preview', provider: 'openrouter' },
      { id: 'anthropic/claude-haiku-5.5', provider: 'openrouter' },
      { id: 'anthropic/claude-haiku-5.5:batch', provider: 'openrouter' },
    ]);
  });
});
