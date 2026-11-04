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

// Up to five places matching a name, each with name, state, country,
// lat and lon. Used for the search suggestions.
export const searchCities = (query, config) =>
    axios
        .get(`${BASE_URL}/geo/1.0/direct`, {
            ...config,
            params: { q: query, limit: 5, appid: API_KEY },
        })
        .then((response) => response.data);

export const isRequestCancelled = axios.isCancel;
