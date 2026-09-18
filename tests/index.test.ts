import { describe, it, expect } from 'vitest';
import { getSupportedProviders } from '../src/index';

describe('getSupportedProviders', () => {
  it('returns the list of currently implemented providers', () => {
    expect(getSupportedProviders()).toEqual(['deepseek']);
  });
});
