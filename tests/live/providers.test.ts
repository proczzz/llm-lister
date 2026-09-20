import { describe, expect, it } from 'vitest';
import { getSupportedProviders, listModels, Provider } from '../../src';

// This package deliberately avoids Node type definitions (it targets Node, Workers
// and browsers), and tests/ is outside tsconfig's scope. Declare only what this
// file needs.
declare const process: { env: Record<string, string | undefined> };

// Live tests talk to the real provider APIs to detect vendor-side changes.
// They are excluded from the default `npm test` and run via `npm run test:live`.
//
// Keys are read from <PROVIDER>_API_KEY (e.g. OPENAI_API_KEY).
// Locally, a missing key skips that provider's test. In CI (LIVE_REQUIRE_KEYS=1)
// a missing key fails instead, so a mistyped secret name can't silently
// turn the scheduled run into a permanent green light.
const requireKeys = process.env.LIVE_REQUIRE_KEYS === '1';

// Providers whose "invalid key" response is not 401.
const invalidKeyStatus: Partial<Record<Provider, number>> = { gemini: 400 };

for (const provider of getSupportedProviders()) {
  const keyName = `${provider.toUpperCase()}_API_KEY`;
  const apiKey = process.env[keyName];

  describe(`${provider} (live)`, () => {
    it.skipIf(!apiKey && !requireKeys)('lists models with a real key', async () => {
      if (!apiKey) throw new Error(`${keyName} is not set`);

      const models = await listModels(provider, apiKey);

      expect(models.length).toBeGreaterThan(0);
      expect(models[0]).toEqual({ id: expect.any(String), provider });
    });

    it('rejects an invalid key', async () => {
      await expect(listModels(provider, 'invalid-key')).rejects.toThrow(String(invalidKeyStatus[provider] ?? 401));
    });
  });
}
