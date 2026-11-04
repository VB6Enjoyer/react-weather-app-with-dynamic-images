import WeatherSearch from "../WeatherSearch/WeatherSearch";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import { useCallback, useEffect } from "react";
import "./WeatherContainer.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { createPortal } from "react-dom";
import conditionGradient from "../../utils/conditionGradient";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import useWeather from "../../hooks/useWeather";
import { placeLabel } from "../../utils/placeUrl";
import kyotoBackground from "../../assets/Kyoto.jpeg";

const BACKGROUND_FADE_MS = 1500;

function WeatherContainer({ currentWeather }) {
    const { weather, isLoading, loadPlace, locateUser, initialPlace } = useWeather();
    const location = weather?.location;
    const conditions = weather?.conditions;

    // Fetch and cross-fade the background once per location
    useEffect(() => {
        if (!location) return;

        const overlay = document.getElementById("overlay");
        if (!overlay) return;

        // Set when the location changes again, so a slow response can't
        // replace the background of a newer search
        let cancelled = false;
        let fadeTimer;

        const showBackground = (url) => {
            // Preload so the fade only starts once the image is ready
            const img = new Image();
            img.onload = () => {
                if (cancelled) return;

                // Fade the new image in on the overlay...
                overlay.style.transition = "none";
                overlay.style.opacity = "0";
                overlay.style.backgroundImage = `url('${url}')`;
                void overlay.offsetWidth; // Forces reflow so the fade starts from 0
                overlay.style.transition = `opacity ${BACKGROUND_FADE_MS}ms ease-in-out`;
                overlay.style.opacity = "1";

                // ...then move it to the body and hide the overlay for the next fade
                fadeTimer = setTimeout(() => {
                    document.body.style.backgroundImage = `url('${url}')`;
                    overlay.style.transition = "none";
                    overlay.style.opacity = "0";
                }, BACKGROUND_FADE_MS);
            };
            img.src = url;
        };

        const fetchBackground = async () => {
            try {
                const response = await axios.get("https://api.unsplash.com/search/photos", {
                    params: {
                        query: location,
                        per_page: 1,
                        client_id: import.meta.env.VITE_UNSPLASH_API_TOKEN,
                    },
                });
                if (cancelled) return;

                const photo = response.data.results[0];
                if (photo) {
                    // urls.full is the multi-megabyte original; ask for a screen-sized version
                    showBackground(`${photo.urls.raw}&w=2400&q=80&auto=format`);
                } else {
                    toast.error(
                        <div>
                            <strong>Error:</strong> Couldn't find an image for the city
                        </div>);
                    showBackground(kyotoBackground);
                }
            } catch (error) {
                if (!cancelled) console.error("Error fetching city image:", error);
            }
        };

        fetchBackground();

        return () => {
            cancelled = true;
            clearTimeout(fadeTimer);
        };
    }, [location]);

    const setHeaderGradient = useCallback((tempColor, day) => {
        if (!tempColor) return;
        if (!conditions) return;

        const colors = conditionGradient(conditions.id, day);

        // Unknown condition code: keep the current header instead of crashing
        if (!colors) return;

        const linearGradient = `linear-gradient(to right, ${colors.join(", ")}, ${tempColor});`;

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
    }, [conditions])

    // Lets App pick the rain, snow or thunder effect
    useEffect(() => {
        currentWeather(conditions?.id);
    }, [conditions, currentWeather]);

    return (
        <div id="weather-container" className="w-full rounded-lg border border-gray-200 bg-white/30 backdrop-blur-md p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
            {createPortal(<Toaster position="bottom-center" reverseOrder={false} />, document.body)}
            <h1 className="text-2xl font-bold mb-4" id="app-header">Weather App</h1>
            <WeatherSearch fetchData={loadPlace} isLoading={isLoading} onLocate={locateUser} initialValue={placeLabel(initialPlace)} />

            {/* A rendering bug in the display shouldn't take the search down with it */}
            <ErrorBoundary resetKey={weather}>
                <WeatherDisplay data={weather} tempColor={setHeaderGradient} />
            </ErrorBoundary>
        </div>
    )
}

export default WeatherContainer;
