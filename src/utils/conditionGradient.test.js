import { describe, expect, it } from 'vitest';
import GradientColors from '../components/WeatherContainer/gradientColors';
import conditionGradient, { gradientIndex } from './conditionGradient';

describe('gradientIndex', () => {
  it('maps condition code groups', () => {
    expect(gradientIndex(200)).toBe(0);
    expect(gradientIndex(232)).toBe(0);
    expect(gradientIndex(501)).toBe(2);
    expect(gradientIndex(800)).toBe(10);
    expect(gradientIndex(804)).toBe(12);
  });

  // Regression: 761 used to have no gradient, which crashed the whole app
  it('maps dust (761) with sand and dust', () => {
    expect(gradientIndex(761)).toBe(6);
  });

  it('returns undefined for unknown codes', () => {
    expect(gradientIndex(799)).toBeUndefined();
    expect(gradientIndex(undefined)).toBeUndefined();
  });
});

describe('conditionGradient', () => {
  it('picks the day or night colors', () => {
    expect(conditionGradient(800, true)).toEqual(GradientColors[10].day);
    expect(conditionGradient(800, false)).toEqual(GradientColors[10].night);
  });

  it('returns null for unknown codes instead of throwing', () => {
    expect(conditionGradient(999, true)).toBeNull();
  });
});
