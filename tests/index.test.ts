import { describe, expect, it } from 'vitest';
import type { Provider } from '../src';
import { listModels } from '../src';

describe('listModels', () => {
  it('throws when the provider is not supported', async () => {
    await expect(listModels('unsupported' as Provider, 'fake-key')).rejects.toThrow(
      'Unsupported provider: "unsupported"',
    );
  });
});
