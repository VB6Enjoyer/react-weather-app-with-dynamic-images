import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readStored, writeStored } from './storage';

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('readStored and writeStored', () => {
  it('round-trips JSON values', () => {
    writeStored('key', { unit: '°F' });
    expect(readStored('key', null)).toEqual({ unit: '°F' });
  });

  it('falls back when nothing is stored', () => {
    expect(readStored('missing', 'default')).toBe('default');
  });

  it('falls back for invalid JSON or values that fail validation', () => {
    localStorage.setItem('broken', 'not json');
    expect(readStored('broken', 'default')).toBe('default');

    writeStored('unit', 'bogus');
    expect(readStored('unit', '°C', (value) => ['°C', '°F'].includes(value))).toBe('°C');
  });

  it('keeps working when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(readStored('key', 'default')).toBe('default');
    expect(() => writeStored('key', 'value')).not.toThrow();
  });
});
