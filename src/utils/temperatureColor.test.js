import { describe, expect, it } from 'vitest';
import temperatureColor from './temperatureColor';

describe('temperatureColor', () => {
  it('runs from blue at -10 °C to red at 40 °C', () => {
    expect(temperatureColor(-10)).toBe('rgb(0, 0, 255)');
    expect(temperatureColor(2.5)).toBe('rgb(0, 255, 255)');
    expect(temperatureColor(15)).toBe('rgb(0, 255, 0)');
    expect(temperatureColor(40)).toBe('rgb(255, 0, 0)');
  });

  it('clamps temperatures outside that range', () => {
    expect(temperatureColor(-30)).toBe(temperatureColor(-10));
    expect(temperatureColor(55)).toBe(temperatureColor(40));
  });
});
