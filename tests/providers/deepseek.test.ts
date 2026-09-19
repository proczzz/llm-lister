import { describe, it, expect, vi, afterEach } from 'vitest';
import { deepSeekAdapter } from '../../src/providers/deepseek';
import modelsFixture from '../fixtures/deepseek-models.json';

describe('deepSeekAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a real /models response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => modelsFixture,
      }),
    );

    const models = await deepSeekAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'deepseek-flash', provider: 'deepseek' },
      { id: 'deepseek-v4-pro', provider: 'deepseek' },
    ]);
  });
});
