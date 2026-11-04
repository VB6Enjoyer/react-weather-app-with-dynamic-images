import { describe, expect, it } from 'vitest';
import { formatHour, formatTime, formatWeekday, localDateKey } from './time';

const HOUR = 3600;

describe('formatTime', () => {
  it('shows midnight and noon correctly in 12-hour format', () => {
    expect(formatTime(0, 0, true)).toBe('12:00 AM');
    expect(formatTime(12 * HOUR, 0, true)).toBe('12:00 PM');
  });

  it('formats afternoon times in both formats', () => {
    const fivepast1pm = 13 * HOUR + 5 * 60;
    expect(formatTime(fivepast1pm, 0, true)).toBe('1:05 PM');
    expect(formatTime(fivepast1pm, 0, false)).toBe('13:05');
  });

  it('pads hours only in 24-hour format', () => {
    expect(formatTime(7 * HOUR, 0, true)).toBe('7:00 AM');
    expect(formatTime(7 * HOUR, 0, false)).toBe('07:00');
  });

  it("uses the location's offset, not the viewer's timezone", () => {
    expect(formatTime(0, -3 * HOUR, false)).toBe('21:00'); // UTC-3, previous evening
    expect(formatTime(0, 5.5 * HOUR, true)).toBe('5:30 AM'); // UTC+5:30
  });

  it('returns an empty string for missing timestamps', () => {
    expect(formatTime(undefined, 0, true)).toBe('');
    expect(formatTime(NaN, 0, false)).toBe('');
  });
});

describe('formatHour', () => {
  it('gives compact forecast labels', () => {
    expect(formatHour(0, 0, true)).toBe('12 AM');
    expect(formatHour(15 * HOUR, 0, true)).toBe('3 PM');
    expect(formatHour(15 * HOUR, 0, false)).toBe('15:00');
  });
});

describe('formatWeekday and localDateKey', () => {
  it("use the location's local date", () => {
    // 1970-01-01T00:00Z was a Thursday; one hour west it's still Wednesday
    expect(formatWeekday(0, 0)).toBe('Thu');
    expect(formatWeekday(0, -HOUR)).toBe('Wed');
    expect(localDateKey(0, 0)).toBe('1970-01-01');
    expect(localDateKey(0, -HOUR)).toBe('1969-12-31');
  });
});
