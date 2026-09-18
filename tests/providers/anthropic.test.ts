import { describe, it, expect, vi, afterEach } from 'vitest';
import { anthropicAdapter } from '../../src/providers/anthropic';

describe('anthropicAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed model list on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [{ id: 'fake-model-a' }, { id: 'fake-model-b' }],
        }),
      }),
    );

    const models = await anthropicAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'fake-model-a', provider: 'anthropic' },
      { id: 'fake-model-b', provider: 'anthropic' },
    ]);
  });

  it('sends the required anthropic-version header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await anthropicAdapter.listModels('fake-key');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/models',
      expect.objectContaining({
        headers: expect.objectContaining({ 'anthropic-version': '2023-06-01' }),
      }),
    );
  });

  it('throws when the API responds with a non-2xx status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      }),
    );

    await expect(anthropicAdapter.listModels('bad-key')).rejects.toThrow(
      'Failed to list Anthropic models: 401 Unauthorized',
    );
  });

  it('throws when the response shape is unexpected', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: 'shape' }),
      }),
    );

    await expect(anthropicAdapter.listModels('fake-key')).rejects.toThrow(
      'Unexpected response shape from Anthropic /v1/models endpoint',
    );
  });
});
