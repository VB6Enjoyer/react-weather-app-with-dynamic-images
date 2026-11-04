import { describe, expect, it } from 'vitest';
import summarizeForecast from './forecast';

const STEP = 3 * 3600;
const TIMEZONE = -3 * 3600; // UTC-3
const START = Date.UTC(2026, 10, 4) / 1000; // 4 Nov 00:00 UTC = 3 Nov 21:00 local

// 40 entries, 3 hours apart, like the real /forecast response. Entry i has
// temp i, so day summaries are easy to check.
const response = {
  city: { timezone: TIMEZONE },
  list: Array.from({ length: 40 }, (_, i) => ({
    dt: START + i * STEP,
    main: { temp: i, temp_min: i - 1, temp_max: i + 1 },
    weather: [{ icon: `icon-${i}`, description: `entry ${i}` }],
    pop: i === 5 ? 0.8 : i === 0 ? undefined : 0,
  })),
};

describe('summarizeForecast', () => {
  const { hourly, daily } = summarizeForecast(response);

  it('takes the next 24 hours as eight 3-hour entries', () => {
    expect(hourly).toHaveLength(8);
    expect(hourly[0]).toEqual({ time: START, temp: 0, icon: 'icon-0', description: 'entry 0', pop: 0 });
  });

  it("groups days by the location's local date and keeps five", () => {
    expect(daily.map((day) => day.date)).toEqual([
      '2026-11-03', // Only the 21:00 entry falls on this local date
      '2026-11-04',
      '2026-11-05',
      '2026-11-06',
      '2026-11-07',
    ]);
  });

  it("summarizes a day's low, high and highest chance of precipitation", () => {
    // Local 4 Nov holds entries 1-8
    expect(daily[1]).toMatchObject({ min: 0, max: 9, pop: 0.8 });
  });

  it('represents a day with the entry closest to early afternoon', () => {
    // Entry 5 is 12:00 local, the closest to 13:00
    expect(daily[1]).toMatchObject({ time: START + 5 * STEP, icon: 'icon-5' });
  });

  it('treats a missing chance of precipitation as zero', () => {
    expect(daily[0].pop).toBe(0);
  });
});
