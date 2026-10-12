import { afterEach, describe, expect, it, vi } from 'vitest';
import { xaiAdapter } from '../../src/providers/xai';
import modelsFixture from '../fixtures/xai-models.json';

describe('xaiAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a real /v1/models response and keeps ids verbatim (ignoring aliases)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => modelsFixture,
      }),
    );

    const models = await xaiAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'grok-4.20-0309-non-reasoning', provider: 'xai' },
      { id: 'grok-4.3', provider: 'xai' },
    ]);
  });
});
