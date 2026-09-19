import { describe, it, expect } from 'vitest';
import { assertResponseOk, isModelsResponse } from '../src/validators';

describe('isModelsResponse', () => {
  it('accepts a response whose data items all have a string id', () => {
    expect(isModelsResponse({ data: [{ id: 'fake-model-a' }, { id: 'fake-model-b' }] })).toBe(true);
  });

  it('accepts an empty model list', () => {
    expect(isModelsResponse({ data: [] })).toBe(true);
  });

  it.each([
    ['null', null],
    ['a non-object', 'oops'],
    ['an object without data', { unexpected: 'shape' }],
    ['data that is not an array', { data: {} }],
    ['an item that is not an object', { data: ['fake-model-a'] }],
    ['an item that is null', { data: [null] }],
    ['an item without id', { data: [{ name: 'fake-model-a' }] }],
    ['an item whose id is not a string', { data: [{ id: 1 }] }],
    ['one bad item among valid ones', { data: [{ id: 'fake-model-a' }, {}] }],
  ])('rejects %s', (_label, body) => {
    expect(isModelsResponse(body)).toBe(false);
  });
});

describe('assertResponseOk', () => {
  it('throws with the provider name and status when the response is not ok', () => {
    const response = { ok: false, status: 401, statusText: 'Unauthorized' } as Response;

    expect(() => assertResponseOk(response, 'FakeProvider')).toThrow(
      'Failed to list FakeProvider models: 401 Unauthorized',
    );
  });
});
