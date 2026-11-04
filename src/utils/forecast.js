import { localDateKey, toLocalDate } from "./time";

const HOURLY_ENTRIES = 8; // The API steps in 3 hours, so this covers 24 hours
const DAYS = 5;

const simplify = (entry) => ({
    time: entry.dt,
    temp: entry.main.temp,
    icon: entry.weather[0].icon,
    description: entry.weather[0].description,
    pop: entry.pop ?? 0, // Probability of precipitation, 0 to 1
});

// Turns the raw /forecast response into the next 24 hours and one summary
// per day, grouped by the location's local date (not the viewer's)
export default function summarizeForecast({ list, city }) {
    const timezone = city.timezone;
    const hourly = list.slice(0, HOURLY_ENTRIES).map(simplify);

    const entriesByDate = new Map();
    for (const entry of list) {
        const date = localDateKey(entry.dt, timezone);
        if (!entriesByDate.has(date)) entriesByDate.set(date, []);
        entriesByDate.get(date).push(entry);
    }

    const localHour = (entry) => toLocalDate(entry.dt, timezone).getUTCHours();
    const distanceFromMidday = (entry) => Math.abs(localHour(entry) - 13);

    const daily = [...entriesByDate].slice(0, DAYS).map(([date, entries]) => {
        // The entry closest to early afternoon represents the day best
        const representative = entries.reduce((best, entry) =>
            distanceFromMidday(entry) < distanceFromMidday(best) ? entry : best
        );

        return {
            ...simplify(representative),
            date,
            min: Math.min(...entries.map((entry) => entry.main.temp_min)),
            max: Math.max(...entries.map((entry) => entry.main.temp_max)),
            pop: Math.max(...entries.map((entry) => entry.pop ?? 0)),
        };
    });

    return { hourly, daily };
}
