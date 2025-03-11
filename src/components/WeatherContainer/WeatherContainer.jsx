import WeatherSearch from "../WeatherSearch/WeatherSearch";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import { useCallback, useEffect, useState } from "react";
import "./WeatherContainer.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { createPortal } from "react-dom";
import GradientColors from "./gradientColors";

function WeatherContainer({ currentWeather }) {
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
    const [isLoading, setIsLoading] = useState(false);

    const fetchWeatherData = async (search) => {
        if (!search.trim()) {
            toast.error(
                <div>
                    <strong>Error:</strong> Please enter a location
                </div>);
            return;
        }

        setIsLoading(true);
        setError(null);


        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_TOKEN;

        await toast.promise(
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${search}&id=524901&appid=${API_KEY}&units=metric`),
            {
                loading: 'Loading...',
                success: (response) => {
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
                    return <b>Weather loaded!</b>;
                },
                error: (error) => {
                    setDisplay(false);
                    setError(true);
                    console.error(error);
                    return <strong>Couldn't find the specified location</strong>;
                },
            }
        );

        setIsLoading(false);
        return search;
    }

    const changeBackgroundImage = useCallback(async () => {
        if (!location) {
            return;
        }

        const API_KEY = import.meta.env.VITE_UNSPLASH_API_TOKEN;
        const overlay = document.getElementById("overlay");
        if (!overlay) return;

        try {
            const response = await axios.get(
                `https://api.unsplash.com/search/photos?query=${location}&client_id=${API_KEY}&per_page=1`
            );
            const data = response.data;

            if (data.results.length > 0) {
                overlay.style.transition = "opacity 1.5s ease-in-out";
                overlay.style.opacity = 0;

                const imageUrl = data.results[0].urls.full.replace(" ", ""); // Get the first image result
                setPrevBg(imageUrl);

                // Preload the new image
                const img = new Image();
                img.src = imageUrl;
                img.crossOrigin = "anonymous"

                img.onload = async () => {
                    overlay.style.backgroundImage = `url('${imageUrl}')`;
                };

                overlay.style.opacity = 1;
            } else {
                toast.error(
                    <div>
                        <strong>Error:</strong> Couldn't find an image for the city
                    </div>);
                overlay.style.transition = "background-image 2s ease-in-out";
                overlay.style.backgroundImage = "url('./assets/Kyoto.jpeg')";
                overlay.style.opacity = "1"
            }
        } catch (error) {
            console.error("Error fetching city image:", error);
        } finally {
            setTimeout(async () => {
                overlay.style.opacity = 0;
                document.body.style.transition = "background-image 1.5s ease-in-out";
                document.body.style.backgroundImage = `url('${prevBg}')`;
            }, 1500);
        }
    }, [location, prevBg]);

    const setHeaderGradient = useCallback((tempColor, day) => {
        if (!tempColor) return;
        if (!weather) return;

        const id = weather.id;
        let index;

        if (id >= 200 && id <= 232) index = 0;
        if (id >= 300 && id <= 321) index = 1;
        if (id >= 500 && id <= 531) index = 2;
        if (id >= 600 && id <= 622) index = 3;
        if (id == 701 || id == 741) index = 4;
        if (id == 711 || id == 721) index = 5;
        if (id == 731 || id == 751) index = 6;
        if (id == 762) index = 7;
        if (id == 771) index = 8;
        if (id == 781) index = 9;
        if (id == 800) index = 10;
        if (id == 801 || id == 802) index = 11;
        if (id == 803 || id == 804) index = 12;

        let linearGradient;
        if (day) {
            linearGradient = `linear-gradient(to right,
            ${GradientColors[index].day[0]},
            ${GradientColors[index].day[1]},
            ${GradientColors[index].day[2]},
            ${tempColor});`
        } else {
            linearGradient = `linear-gradient(to right,
            ${GradientColors[index].night[0]},
            ${GradientColors[index].night[1]},
            ${GradientColors[index].night[2]},
            ${tempColor});`
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-gradient-style';

        styleElement.innerHTML = `
            #app-header {
                background: ${linearGradient};
                color: transparent;
                animation: rainbow-move 8s linear infinite;
                background-size: 200% auto;
                text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1);
                -webkit-background-clip: text;
                background-clip: text;
            }
                
            @keyframes rainbow-move {
                0% {
                    background-position: 0% center;
                }

                100% {
                    background-position: -200% center;
                }
            }`;

        const existingStyleElement = document.getElementById('dynamic-gradient-style');
        if (existingStyleElement) existingStyleElement.remove();

        document.head.appendChild(styleElement);
    }, [weather])

    useEffect(() => {
        changeBackgroundImage();
        setHeaderGradient();
        currentWeather(weather.id);
    }, [location, changeBackgroundImage, setHeaderGradient, weather, currentWeather]);

    return (
        <div id="weather-container" className="w-full rounded-lg border border-gray-200 bg-white/30 backdrop-blur-md p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
            {createPortal(<Toaster position="bottom-center" reverseOrder={false} />, document.body)}
            <h1 className="text-2xl font-bold mb-4" id="app-header">Weather App</h1>
            <WeatherSearch fetchData={fetchWeatherData} isLoading={isLoading} />

            {!error
                ? <WeatherDisplay
                    loc={location}
                    mainObj={main}
                    weatherObj={weather}
                    countryCode={country}
                    windObj={wind}
                    sysObj={sys}
                    timez={timezone}
                    visible={display}
                    tempColor={setHeaderGradient} />
                : ""}
        </div>
    )
}

export default WeatherContainer;
