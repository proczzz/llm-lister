import { describe, it, expect, vi, afterEach } from 'vitest';
import { deepSeekAdapter } from '../../src/providers/deepseek';

describe('deepSeekAdapter.listModels', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // 正常路徑:假設 API 回應正確,確認轉換邏輯 { id } → { id, provider } 沒問題
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

    const models = await deepSeekAdapter.listModels('fake-key');

    expect(models).toEqual([
      { id: 'fake-model-a', provider: 'deepseek' },
      { id: 'fake-model-b', provider: 'deepseek' },
    ]);
  });

  // HTTP 錯誤路徑:確認 response.ok 為 false 時,會丟出清楚的錯誤訊息
  it('throws when the API responds with a non-2xx status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      }),
    );

    await expect(deepSeekAdapter.listModels('bad-key')).rejects.toThrow(
      'Failed to list DeepSeek models: 401 Unauthorized',
    );
  });

  // 格式不符路徑:確認型別守衛有攔住不符預期的回應內容
  it('throws when the response shape is unexpected', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: 'shape' }),
      }),
    );

    await expect(deepSeekAdapter.listModels('fake-key')).rejects.toThrow(
      'Unexpected response shape from DeepSeek /models endpoint',
    );
  });
});
