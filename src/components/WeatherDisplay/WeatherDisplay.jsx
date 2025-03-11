import "./WeatherDisplay.css";
import { Droplets, Sunrise, Sunset, Thermometer, Cloud, Wind } from "lucide-react"
import { useCallback, useEffect, useState } from "react";

function WeatherDisplay({ loc, mainObj, weatherObj, countryCode, windObj, sysObj, timez, visible, tempColor }) {
    const [animationClass, setAnimationClass] = useState('');
    const [location, setLocation] = useState("");
    const [main, setMain] = useState("");
    const [temperature, setTemperature] = useState(0);
    const [feelsLike, setFeelsLike] = useState(0);
    const [weather, setWeather] = useState("");
    const [country, setCountry] = useState("");
    const [wind, setWind] = useState({});
    const [windSpeed, setWindSpeed] = useState(0);
    const [sys, setSys] = useState({});
    const [timezone, setTimezone] = useState(0);
    const [tempScale, setTempScale] = useState("°C");
    const [speedSys, setSpeedSys] = useState("KM/h")
    const [sunrise, setSunrise] = useState("");
    const [sunset, setSunset] = useState("");
    const [format12, setFormat12] = useState(true);

    const getFlag = () => {
        if (!country) {
            return;
        }

        return <span id="country-flag" title={country}>{country.toUpperCase().split("").map(char => String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65)).join("")}</span>;
    }

    const getTemperatureColor = (temp) => {
        const minTemp = tempScale == "°C" ? -10 : tempScale == "°F" ? 14 : 263.15; // Extreme cold
        const maxTemp = tempScale == "°C" ? 40 : tempScale == "°F" ? 104 : 313.15;  // Extreme hot

        // Clamp temperature within the range
        const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));

        // Normalize temperature to a 0-1 scale
        const ratio = (clampedTemp - minTemp) / (maxTemp - minTemp);

        let r, g, b;

        if (ratio < 0.25) { // Cold: Blue → Cyan
            r = 0;
            g = Math.round(255 * (ratio / 0.25));
            b = 255;
        } else if (ratio < 0.5) { // Cool: Cyan → Green
            r = 0;
            g = 255;
            b = Math.round(255 * (1 - (ratio - 0.25) / 0.25));
        } else if (ratio < 0.75) { // Warm: Green → Yellow → Orange
            r = Math.round(255 * ((ratio - 0.5) / 0.25));
            g = 255;
            b = 0;
        } else { // Hot: Orange → Red
            r = 255;
            g = Math.round(255 * (1 - (ratio - 0.75) / 0.25));
            b = 0;
        }

        const formattedColor = `rgb(${r}, ${g}, ${b})`;
        let day;

        if (weather.icon[2] == "d") {
            day = true;
        } else {
            day = false;
        }

        tempColor(formattedColor, day);
        return formattedColor;
    };

    const getIcon = () => {
        return `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    }

    const dangerWarning = () => {
        if ([202, 212, 221, 232].includes(weather.id)) {
            return <p id="warning-icon" title="Dangerous thunderstorms">⚠️</p>
        } else if ([503, 504, 511, 522].includes(weather.id)) {
            return <p id="warning-icon" title="Heavy rain with flood risk">⚠️</p>
        } else if ([602, 613, 621, 622].includes(weather.id)) {
            return <p id="warning-icon" title="Heavy snow and icing">⚠️</p>
        } else if ([762, 771, 781].includes(weather.id)) {
            return <p id="warning-icon" title="Hazardous atmospheric conditions">☣️</p>
        } else {
            return "";
        }
    }

    const changeTempScale = (e) => {
        e.preventDefault();
        if (tempScale == "°C") {
            setTempScale("°F");
            setTemperature(main.temp * 9 / 5 + 32);
            setFeelsLike(main.feels_like * 9 / 5 + 32);
        } else if (tempScale == "°F") {
            setTempScale("K");
            setTemperature(main.temp + 273.15);
            setFeelsLike(main.feels_like + 273.15);
        } else {
            setTempScale("°C");
            setTemperature(main.temp);
            setFeelsLike(main.feels_like);
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

        if (speedSys == "KM/h") {
            setSpeedSys("M/h");
            setWindSpeed((wind.speed * 2.23694).toFixed(1));
        } else {
            setSpeedSys("KM/h");
            setWindSpeed((windObj.speed * 3.6).toFixed(1));
        }
    }

    const formatTime = useCallback((timestamp, format) => {
        const localTime = new Date((timestamp + timezone) * 1000);
        let daytime;

        let hours = localTime.getUTCHours();
        const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");

        if (format && hours > 12) {
            hours = String(hours - 12).padStart(2, "0");
            daytime = "PM";
        } else {
            hours = String(hours);
            daytime = "AM";
        }

        if (format) {
            return `${hours}:${minutes} ${daytime}`
        } else {
            return `${hours}:${minutes}`
        }
    }, [timezone]);

    const changeTimeFormat = (e) => {
        e.preventDefault();

        setFormat12(prevFormat => !prevFormat);

        setSunrise(formatTime(sys.sunrise, format12));
        setSunset(formatTime(sys.sunset, format12));
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
                setTemperature(mainObj.temp);
                setFeelsLike(mainObj.feels_like)
                setWeather(weatherObj);
                setCountry(countryCode);
                setWind(windObj);
                setWindSpeed((windObj.speed * 3.6).toFixed(1));
                setSys(sysObj);
                setTimezone(timez);
                setSunrise(formatTime(sysObj.sunrise));
                setSunset(formatTime(sysObj.sunset));
            }, 400); //

            return () => clearTimeout(timer);
        } else {
            setAnimationClass('weather-display-update');
        }
    }, [location, visible, countryCode, loc, mainObj, sysObj, timez, weatherObj, windObj, formatTime]);

    return (
        <div id="weather-display" className={animationClass}>
            {visible && location ? <>
                <span id="weather-header">
                    <h2 id="location">{location} {getFlag()}</h2>
                    <img id="weather-icon" src={getIcon()} alt={weather.main} title={weather.description.charAt(0).toUpperCase() + weather.description.slice(1) || ""} />
                    {dangerWarning()}
                </span>

                <div id="data-container">
                    <div className="weather-data-container interactive-container" id="temperature-container" onClick={(e) => changeTempScale(e)}>
                        <Thermometer className="data-icon" />
                        <span id="temperature" className="weather-data">
                            <b className="data-header non-selectable">Temperature</b>
                            <span>
                                <p className="weather-value" id="temperature-value" style={{ color: getTemperatureColor(temperature) }}>{
                                    temperature
                                        ? `${Math.round(temperature)}`
                                        : "Error"}</p>
                                <p className="inline">{tempScale}</p>
                            </span>
                            {feelsLike
                                ? <span id="feels-like-container"> Feels like
                                    <p id="feels-like" style={{ color: getTemperatureColor(feelsLike) }}>{` ${Math.round(feelsLike)}`}</p>
                                    <p className="inline">{tempScale}</p>
                                </span>
                                : ""}
                        </span>
                    </div>

                    <div className="weather-data-container">
                        <Cloud className="data-icon" />
                        <span id="weather" className="weather-data">
                            <b className="data-header non-selectable">Weather</b>
                            <p className="weather-value" id="weather-value">{`${weather.main || "Error"}`}</p>
                        </span>
                    </div>

                    <div className="weather-data-container">
                        <Droplets className="data-icon" />
                        <span id="humidity" className="weather-data">
                            <b className="data-header non-selectable">Humidity</b>
                            <p className="weather-value" id="humidity-value">{main.humidity}%</p>
                        </span>
                    </div>

                    <div className="weather-data-container interactive-container" onClick={(e) => changeWindSpeed(e)}>
                        <Wind className="data-icon" />
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

                    <div className="weather-data-container interactive-container" onClick={(e) => changeTimeFormat(e)}>
                        <Sunrise className="data-icon" />
                        <span id="sunrise" className="weather-data">
                            <b className="data-header non-selectable">Sunrise </b>
                            <p className="weather-value inline" id="sunrise-value">{sunrise}</p>
                        </span>
                    </div>

                    <div className="weather-data-container interactive-container" onClick={(e) => changeTimeFormat(e)}>
                        <Sunset className="data-icon" />
                        <span id="sunset" className="weather-data">
                            <b className="data-header non-selectable">Sunset </b>
                            <p className="weather-value inline" id="sunset-value">{sunset}</p>
                        </span>
                    </div>
                </div>
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
                <p id="min-temp" style={{ color: getTemperatureColor(main.temp_min) }}>{Math.round(main.temp_min) || "?"}</p>/
                <p id="max-temp" style={{ color: getTemperatureColor(main.temp_max) }}>{Math.round(main.temp_max) || "?"}</p>
            </>
        }</span>
    </span>
</div>
--------------------------------------------------
*/