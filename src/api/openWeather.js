import axios from "axios";

const BASE_URL = "https://api.openweathermap.org";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_TOKEN;

// A place is either { query: "Concordia" } for free text or
// { lat, lon } for exact coordinates (suggestions, geolocation)
const placeParams = (place) =>
    place.query != null
        ? { q: place.query.trim() }
        : { lat: place.lat, lon: place.lon };

export const getCurrentWeather = (place, config) =>
    axios.get(`${BASE_URL}/data/2.5/weather`, {
        ...config,
        params: { ...placeParams(place), appid: API_KEY, units: "metric" },
    });
