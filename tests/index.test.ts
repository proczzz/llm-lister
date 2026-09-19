import { describe, it, expect } from 'vitest';
import { listModels } from '../src';
import type { Provider } from '../src';

describe('listModels', () => {
  it('throws when the provider is not supported', async () => {
    await expect(listModels('unsupported' as Provider, 'fake-key')).rejects.toThrow(
      'Unsupported provider: "unsupported"',
    );
  });
});
