import WeatherSearch from "../WeatherSearch/WeatherSearch";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import { useCallback, useEffect, useState } from "react";
import "./WeatherContainer.css";
import axios from "axios";

function WeatherContainer() {
    const [display, setDisplay] = useState(false);
    const [location, setLocation] = useState("");
    const [main, setMain] = useState("");
    const [weather, setWeather] = useState("");
    const [country, setCountry] = useState("");
    const [wind, setWind] = useState({});
    const [sys, setSys] = useState({});
    const [timezone, setTimezone] = useState(0);
    const [prevBg, setPrevBg] = useState("./assets/Kyoto.jpeg");
    const [error, setError] = useState(false);

    const fetchWeatherData = async (search) => {
        try {
            const API_KEY = import.meta.env.VITE_OPENWEATHER_API_TOKEN;
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${search}&id=524901&appid=${API_KEY}&units=metric`);

            if (response) {
                setLocation(response.data.name);
                setMain(response.data.main);
                setWeather(response.data.weather[0]);
                setCountry(response.data.sys.country);
                setWind(response.data.wind);
                setSys(response.data.sys);
                setTimezone(response.data.timezone);

                setDisplay(true);
                setError(false);
            }
        } catch (error) {
            setDisplay(false);
            setError(true);
            throw new Error(error);
        }

        return search;
    }

    const changeBackgroundImage = useCallback(async () => {
        if (!location) {
            return;
        }

        const API_KEY = import.meta.env.VITE_UNSPLASH_API_TOKEN;
        const overlay = document.getElementById("overlay");

        try {
            const response = await axios.get(
                `https://api.unsplash.com/search/photos?query=${location}&client_id=${API_KEY}&per_page=1`
            );
            const data = response.data;

            overlay.style.transition = "opacity 1s ease-in-out";
            overlay.style.opacity = 0;

            if (data.results.length > 0) {
                const imageUrl = data.results[0].urls.full.replace(" ", ""); // Get the first image result
                setPrevBg(imageUrl);

                // Preload the new image
                const img = new Image();
                img.src = imageUrl;

                img.onload = () => {
                    overlay.style.backgroundImage = `url('${imageUrl}')`;
                };

                overlay.style.opacity = 1;
            } else {
                console.error("No images found for this city.");
                overlay.style.transition = "background-image 2s ease-in-out";
                overlay.style.backgroundImage = "url('./assets/Kyoto.jpeg')";
                overlay.style.opacity = "1"
            }
        } catch (error) {
            console.error("Error fetching city image:", error);
        } finally {
            setTimeout(() => {
                overlay.style.opacity = 0;
                document.body.style.transition = "background-image 2s ease-in-out";
                document.body.style.backgroundImage = `url('${prevBg}')`;
            }, 1000);
        }
    }, [location, prevBg]);

    useEffect(() => {
        changeBackgroundImage();
    }, [location, changeBackgroundImage]);

    return (
        <div id="weather-container">
            <h1>Weather App</h1>
            <WeatherSearch fetchData={fetchWeatherData} />
            {!error
                ? <WeatherDisplay loc={location} mainObj={main} weatherObj={weather} countryCode={country} windObj={wind} sysObj={sys} timez={timezone} visible={display} />
                : <p id="error-message">Couldn't find the specified location.</p>}
        </div>
    )
}

export default WeatherContainer;
