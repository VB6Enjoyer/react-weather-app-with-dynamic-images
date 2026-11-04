import { describe, expect, it } from 'vitest';
import windDirection from './windDirection';

const label = (degrees) => windDirection(degrees)?.label;

describe('windDirection', () => {
  it('maps degrees to compass points', () => {
    expect(label(0)).toBe('N');
    expect(label(90)).toBe('E');
    expect(label(135)).toBe('SE');
    expect(label(180)).toBe('S');
    expect(label(270)).toBe('W');
  });

  it('puts values exactly on a boundary in the earlier point', () => {
    expect(label(22.5)).toBe('N');
    expect(label(22.6)).toBe('NE');
    expect(label(337.5)).toBe('NW');
    expect(label(337.6)).toBe('N');
  });

  it('normalizes values outside 0-360', () => {
    expect(label(360)).toBe('N');
    expect(label(450)).toBe('E');
    expect(label(-90)).toBe('W');
  });

  it('returns null when the direction is unknown', () => {
    expect(windDirection(undefined)).toBeNull();
    expect(windDirection(NaN)).toBeNull();
  });
});
