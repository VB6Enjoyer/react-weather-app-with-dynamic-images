import GradientColors from "../components/WeatherContainer/gradientColors";

// Index into GradientColors for an OpenWeather condition code
// (https://openweathermap.org/weather-conditions), or undefined if unknown
export function gradientIndex(id) {
    if (id >= 200 && id <= 232) return 0; // Thunderstorm
    if (id >= 300 && id <= 321) return 1; // Drizzle
    if (id >= 500 && id <= 531) return 2; // Rain
    if (id >= 600 && id <= 622) return 3; // Snow
    if (id === 701 || id === 741) return 4; // Mist, fog
    if (id === 711 || id === 721) return 5; // Smoke, haze
    if (id === 731 || id === 751 || id === 761) return 6; // Sand, dust
    if (id === 762) return 7; // Volcanic ash
    if (id === 771) return 8; // Squalls
    if (id === 781) return 9; // Tornado
    if (id === 800) return 10; // Clear
    if (id === 801 || id === 802) return 11; // Few or scattered clouds
    if (id === 803 || id === 804) return 12; // Broken clouds, overcast
    return undefined;
}

// The three gradient colors for a condition by day or night, or null if
// the condition is unknown
export default function conditionGradient(id, isDay) {
    const entry = GradientColors[gradientIndex(id)];
    if (!entry) return null;
    return isDay ? entry.day : entry.night;
}
