import { describe, expect, it } from 'vitest';
import { SPEED_UNITS, TEMPERATURE_UNITS, convertSpeed, convertTemperature, nextUnit } from './units';

describe('convertTemperature', () => {
  it('converts Celsius to the selected unit', () => {
    expect(convertTemperature(20, '°C')).toBe(20);
    expect(convertTemperature(0, '°F')).toBe(32);
    expect(convertTemperature(100, '°F')).toBe(212);
    expect(convertTemperature(-40, '°F')).toBe(-40);
    expect(convertTemperature(0, 'K')).toBeCloseTo(273.15);
  });
});

describe('convertSpeed', () => {
  it('converts metres per second to km/h or mph', () => {
    expect(convertSpeed(10, 'KM/h')).toBeCloseTo(36);
    expect(convertSpeed(10, 'M/h')).toBeCloseTo(22.3694);
  });
});

describe('nextUnit', () => {
  it('cycles through the units and wraps around', () => {
    expect(nextUnit(TEMPERATURE_UNITS, '°C')).toBe('°F');
    expect(nextUnit(TEMPERATURE_UNITS, '°F')).toBe('K');
    expect(nextUnit(TEMPERATURE_UNITS, 'K')).toBe('°C');
    expect(nextUnit(SPEED_UNITS, 'M/h')).toBe('KM/h');
  });
});
