import "./WeatherDisplay.css";
import { Droplets, Sunrise, Sunset, Thermometer, Cloud, Wind } from "lucide-react"
import { useEffect, useState } from "react";
import { formatTime, formatWeekday } from "../../utils/time";
import useNow from "../../hooks/useNow";
import temperatureColor from "../../utils/temperatureColor";
import Forecast from "../Forecast/Forecast";

// English country names for the flag's label and tooltip, e.g. "AR" -> "Argentina"
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

// Makes a data card behave like a button for keyboard and screen reader users
const toggleProps = (onToggle, hint) => ({
    role: "button",
    tabIndex: 0,
    title: hint,
    onClick: onToggle,
    onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") onToggle(e); // Handlers call preventDefault, so Space won't scroll
    },
});

function WeatherDisplay({ loc, mainObj, weatherObj, countryCode, windObj, sysObj, timez, forecastData, visible, tempColor }) {
    const [animationClass, setAnimationClass] = useState('');
    const [location, setLocation] = useState("");
    const [main, setMain] = useState("");
    const [weather, setWeather] = useState("");
    const [country, setCountry] = useState("");
    const [wind, setWind] = useState({});
    const [sys, setSys] = useState({});
    const [timezone, setTimezone] = useState(0);
    const [forecast, setForecast] = useState(null);
    const [tempScale, setTempScale] = useState("°C");
    const [speedSys, setSpeedSys] = useState("KM/h")
    const [format12, setFormat12] = useState(true);

    // The API returns Celsius and m/s; convert at render time so the selected
    // units always apply to the data currently shown
    const convertTemp = (celsius) => {
        if (tempScale == "°F") return celsius * 9 / 5 + 32;
        if (tempScale == "K") return celsius + 273.15;
        return celsius;
    }

    const temperature = convertTemp(main.temp);
    const feelsLike = convertTemp(main.feels_like);
    const windSpeed = (wind.speed * (speedSys == "KM/h" ? 3.6 : 2.23694)).toFixed(1);

    const getFlag = () => {
        if (!country) {
            return;
        }

        const countryName = regionNames.of(country.toUpperCase()) || country;

        return <span id="country-flag" role="img" aria-label={countryName} title={countryName}>{country.toUpperCase().split("").map(char => String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65)).join("")}</span>;
    }

    // Tint the header gradient with the current temperature and time of day
    useEffect(() => {
        if (!Number.isFinite(main.temp) || !weather.icon) return;

        tempColor(temperatureColor(main.temp), weather.icon.endsWith("d"));
    }, [main, weather, tempColor]);

    const getIcon = () => {
        return `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    }

    const dangerWarning = () => {
        if ([202, 212, 221, 232].includes(weather.id)) {
            return <p id="warning-icon" role="img" aria-label="Dangerous thunderstorms" title="Dangerous thunderstorms">⚠️</p>
        } else if ([503, 504, 511, 522].includes(weather.id)) {
            return <p id="warning-icon" role="img" aria-label="Heavy rain with flood risk" title="Heavy rain with flood risk">⚠️</p>
        } else if ([602, 613, 621, 622].includes(weather.id)) {
            return <p id="warning-icon" role="img" aria-label="Heavy snow and icing" title="Heavy snow and icing">⚠️</p>
        } else if ([762, 771, 781].includes(weather.id)) {
            return <p id="warning-icon" role="img" aria-label="Hazardous atmospheric conditions" title="Hazardous atmospheric conditions">☣️</p>
        } else {
            return "";
        }
    }

    const changeTempScale = (e) => {
        e.preventDefault();
        if (tempScale == "°C") {
            setTempScale("°F");
        } else if (tempScale == "°F") {
            setTempScale("K");
        } else {
            setTempScale("°C");
        }
    }

    const getWindDirection = () => {
        const deg = wind.deg;

        if ((deg >= 0 && deg <= 22.5) || deg > 337.5) {
            return <p id="wind-direction">N ⬆️</p>
        } else if (deg > 22.5 && deg <= 67.5) {
            return <p id="wind-direction">NE ↗️</p>
        } else if (deg > 67.5 && deg <= 112.5) {
            return <p id="wind-direction">E ➡️</p>
        } else if (deg > 112.5 && deg <= 157.5) {
            return <p id="wind-direction">SE ↘️</p>
        } else if (deg > 157.5 && deg <= 202.5) {
            return <p id="wind-direction">S ⬇️</p>
        } else if (deg > 202.5 && deg <= 247.5) {
            return <p id="wind-direction">SW ↙️</p>
        } else if (deg > 247.5 && deg <= 292.5) {
            return <p id="wind-direction">W ⬅️</p>
        } else if (deg > 292.5 && deg <= 337.5) {
            return <p id="wind-direction">NW ↖️</p>
        }
    }

    const changeWindSpeed = (e) => {
        e.preventDefault();

        setSpeedSys(speedSys == "KM/h" ? "M/h" : "KM/h");
    }

    const now = useNow();
    const localTime = `${formatWeekday(now, timezone)} ${formatTime(now, timezone, format12)}`;

    const sunrise = formatTime(sys.sunrise, timezone, format12);
    const sunset = formatTime(sys.sunset, timezone, format12);

    const changeTimeFormat = (e) => {
        e.preventDefault();

        setFormat12(prevFormat => !prevFormat);
    }

    // Reset animation when visible changes or new data is loaded
    useEffect(() => {
        if (visible) {
            setAnimationClass('weather-display-update'); // Make the component invisible with CSS

            // Force a reflow and update content while invisible
            const timer = setTimeout(() => {
                setAnimationClass('weather-display-update-active'); // After the fade-out completes, start fade-in
                setLocation(loc);
                setMain(mainObj);
                setWeather(weatherObj);
                setCountry(countryCode);
                setWind(windObj);
                setSys(sysObj);
                setTimezone(timez);
                setForecast(forecastData);
            }, 400); //

            return () => clearTimeout(timer);
        } else {
            setAnimationClass('weather-display-update');
        }
    }, [location, visible, countryCode, loc, mainObj, sysObj, timez, forecastData, weatherObj, windObj]);

    return (
        <div id="weather-display" className={animationClass}>
            {visible && location ? <>
                <span id="weather-header">
                    <h2 id="location">{location} {getFlag()}</h2>
                    <img id="weather-icon" src={getIcon()} alt={weather.main} title={weather.description.charAt(0).toUpperCase() + weather.description.slice(1) || ""} />
                    {dangerWarning()}
                    <p id="local-time">Local time: <span className="local-time-value">{localTime}</span></p>
                </span>

                <div id="data-container">
                    <div className="weather-data-container interactive-container" id="temperature-container" {...toggleProps(changeTempScale, "Switch between °C, °F and K")}>
                        <Thermometer className="data-icon" aria-hidden="true" />
                        <span id="temperature" className="weather-data">
                            <b className="data-header non-selectable">Temperature</b>
                            <span>
                                <p className="weather-value" id="temperature-value" style={{ color: temperatureColor(main.temp) }}>{
                                    Number.isFinite(temperature)
                                        ? `${Math.round(temperature)}`
                                        : "Error"}</p>
                                <p className="inline">{tempScale}</p>
                            </span>
                            {Number.isFinite(feelsLike)
                                ? <span id="feels-like-container"> Feels like
                                    <p id="feels-like" style={{ color: temperatureColor(main.feels_like) }}>{` ${Math.round(feelsLike)}`}</p>
                                    <p className="inline">{tempScale}</p>
                                </span>
                                : ""}
                        </span>
                    </div>

                    <div className="weather-data-container">
                        <Cloud className="data-icon" aria-hidden="true" />
                        <span id="weather" className="weather-data">
                            <b className="data-header non-selectable">Weather</b>
                            <p className="weather-value" id="weather-value">{`${weather.main || "Error"}`}</p>
                        </span>
                    </div>

                    <div className="weather-data-container">
                        <Droplets className="data-icon" aria-hidden="true" />
                        <span id="humidity" className="weather-data">
                            <b className="data-header non-selectable">Humidity</b>
                            <p className="weather-value" id="humidity-value">{main.humidity}%</p>
                        </span>
                    </div>

                    <div className="weather-data-container interactive-container" {...toggleProps(changeWindSpeed, "Switch between km/h and mph")}>
                        <Wind className="data-icon" aria-hidden="true" />
                        <span id="wind" className="weather-data">
                            <b className="data-header non-selectable">Wind </b>
                            <span className="weather-value" id="wind-value">{
                                <>
                                    <span id="wind-speed">{windSpeed} <p className="inline">{speedSys}</p> </span>
                                    {getWindDirection()}
                                </>
                            }</span>
                        </span>
                    </div>

                    <div className="weather-data-container interactive-container" {...toggleProps(changeTimeFormat, "Switch between 12-hour and 24-hour time")}>
                        <Sunrise className="data-icon" aria-hidden="true" />
                        <span id="sunrise" className="weather-data">
                            <b className="data-header non-selectable">Sunrise </b>
                            <p className="weather-value inline" id="sunrise-value">{sunrise}</p>
                        </span>
                    </div>

                    <div className="weather-data-container interactive-container" {...toggleProps(changeTimeFormat, "Switch between 12-hour and 24-hour time")}>
                        <Sunset className="data-icon" aria-hidden="true" />
                        <span id="sunset" className="weather-data">
                            <b className="data-header non-selectable">Sunset </b>
                            <p className="weather-value inline" id="sunset-value">{sunset}</p>
                        </span>
                    </div>
                </div>

                <Forecast
                    forecast={forecast}
                    timezone={timezone}
                    now={now}
                    convertTemp={convertTemp}
                    tempScale={tempScale}
                    use12Hour={format12} />
            </> : null
            }
        </div >
    )
}

export default WeatherDisplay;

/* Commented, not using it because it's mostly pointless since this just tells you the min-max across a city
--------------------------------------------------
<div className="weather-data-container">
    <ArrowUpDown className="data-icon" />
    <span id="min-max-temperature" className="weather-data">
        <b className="data-header">Min/Max</b>
        <span className="weather-value" id="min-max-value">{
            <>
                <p id="min-temp" style={{ color: temperatureColor(main.temp_min) }}>{Math.round(main.temp_min) || "?"}</p>/
                <p id="max-temp" style={{ color: temperatureColor(main.temp_max) }}>{Math.round(main.temp_max) || "?"}</p>
            </>
        }</span>
    </span>
</div>
--------------------------------------------------
*/