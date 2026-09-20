import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openAIAdapter } from '../../src/providers/openai';
import modelsFixture from '../fixtures/openai-models.json';

describe('openAIAdapter.listModels', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-10-25T00:00:00Z'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('parses a real /v1/models response and excludes models past their shutdown_date', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => modelsFixture,
      }),
    );

    const models = await openAIAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'gpt-4o-mini', provider: 'openai' },
      { id: 'gpt-5', provider: 'openai' },
      { id: 'gpt-5-pro', provider: 'openai' },
    ]);
  });
});
