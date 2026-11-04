import "./Forecast.css";
import { useId } from "react";
import temperatureColor from "../../utils/temperatureColor";
import { formatHour, formatWeekday, localDateKey } from "../../utils/time";

const MIN_SHOWN_POP = 0.2; // Below a 20% chance, precipitation isn't worth showing

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}.png`;
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function Precipitation({ chance }) {
    if (chance < MIN_SHOWN_POP) return <span className="forecast-pop" />;

    return (
        <span className="forecast-pop" title="Chance of precipitation">
            <span aria-hidden="true">💧</span>
            {Math.round(chance * 100)}%
            <span className="sr-only"> chance of precipitation</span>
        </span>
    );
}

function WeatherIcon({ entry }) {
    return (
        <img
            className="forecast-icon"
            src={iconUrl(entry.icon)}
            alt={entry.description}
            title={capitalize(entry.description)}
            width="40"
            height="40"
        />
    );
}

function Forecast({ forecast, timezone, now, convertTemp, tempScale, use12Hour }) {
    const hourlyHeadingId = useId();
    const dailyHeadingId = useId();

    if (!forecast) return null;

    const today = localDateKey(now, timezone);
    const formatTemp = (celsius) => {
        const value = Math.round(convertTemp(celsius));
        return tempScale === "K" ? `${value} K` : `${value}°`;
    };

    return (
        <section id="forecast">
            <h3 id={hourlyHeadingId} className="forecast-heading">Next 24 hours</h3>
            {/* Scrolls sideways on narrow screens; focusable so it can be scrolled by keyboard */}
            <ol className="hourly-forecast" aria-labelledby={hourlyHeadingId} tabIndex={0}>
                {forecast.hourly.map((hour) => (
                    <li key={hour.time} className="forecast-hour">
                        <span className="forecast-time">{formatHour(hour.time, timezone, use12Hour)}</span>
                        <WeatherIcon entry={hour} />
                        <span className="forecast-temp" style={{ color: temperatureColor(hour.temp) }}>
                            {formatTemp(hour.temp)}
                        </span>
                        <Precipitation chance={hour.pop} />
                    </li>
                ))}
            </ol>

            <h3 id={dailyHeadingId} className="forecast-heading">5-day forecast</h3>
            <ol className="daily-forecast" aria-labelledby={dailyHeadingId}>
                {forecast.daily.map((day) => (
                    <li key={day.date} className="forecast-day">
                        <span className="forecast-weekday">
                            {day.date === today ? "Today" : formatWeekday(day.time, timezone)}
                        </span>
                        <WeatherIcon entry={day} />
                        <Precipitation chance={day.pop} />
                        <span className="forecast-range">
                            <span className="sr-only">Low </span>
                            <span style={{ color: temperatureColor(day.min) }}>{formatTemp(day.min)}</span>
                            <span className="forecast-range-separator" aria-hidden="true">/</span>
                            <span className="sr-only">, high </span>
                            <span style={{ color: temperatureColor(day.max) }}>{formatTemp(day.max)}</span>
                        </span>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export default Forecast;
