import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { getCurrentWeather, getForecast } from '../api/openWeather';
import summarizeForecast from '../utils/forecast';
import { placeFromSearch, placeToSearch } from '../utils/placeUrl';
import { readStored, writeStored } from '../utils/storage';

const LAST_PLACE_KEY = 'weather-app.lastPlace';

// Current weather first, since its coordinates resolve typed names, then the
// forecast. A failed forecast still shows the current weather.
async function fetchWeather(place) {
  const { data: current } = await getCurrentWeather(place);

  let forecast = null;
  try {
    const { data } = await getForecast(current.coord);
    forecast = summarizeForecast(data);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }

  return {
    // A picked suggestion's name beats the nearest weather station's
    location: place.label || current.name,
    country: current.sys.country,
    conditions: current.weather[0],
    main: current.main,
    wind: current.wind,
    sys: current.sys,
    timezone: current.timezone,
    forecast,
    resolvedName: current.name,
  };
}

// Put the place in the address bar so the page can be shared or bookmarked,
// and remember it for the next visit
function rememberPlace(place, resolvedName) {
  const search = placeToSearch(place, resolvedName);
  window.history.replaceState(null, '', search);
  writeStored(LAST_PLACE_KEY, search);
}

// A place in the URL (a shared link) wins over the last place visited
function findInitialPlace() {
  return (
    placeFromSearch(window.location.search) ??
    placeFromSearch(readStored(LAST_PLACE_KEY, '', (value) => typeof value === 'string'))
  );
}

/**
 * Loads weather for a place and tracks the result.
 *
 * A place is { query } from the search box, or { lat, lon, label } from a
 * suggestion or geolocation. Returns `weather` (null until loaded or after a
 * failed search), `isLoading`, `loadPlace(place)`, `locateUser()` and the
 * `initialPlace` it loads on start.
 */
export default function useWeather() {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialPlace] = useState(findInitialPlace);
  const initialLoadStarted = useRef(false);

  const loadPlace = useCallback(async (place) => {
    if (place.query != null && !place.query.trim()) {
      toast.error(
        <div>
          <strong>Error:</strong> Please enter a location
        </div>
      );
      return;
    }

    setIsLoading(true);

    // toast.promise rethrows on failure; its error callback has already
    // updated the UI, so only make sure loading always ends
    try {
      await toast.promise(fetchWeather(place), {
        loading: 'Loading...',
        success: (result) => {
          setWeather(result);
          rememberPlace(place, result.resolvedName);
          return <b>Weather loaded!</b>;
        },
        error: (error) => {
          setWeather(null);
          console.error(error);
          return <strong>Couldn't find the specified location</strong>;
        },
      });
    } catch {
      // Handled by the toast's error callback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Your browser can't share its location");
      return;
    }

    const toastId = toast.loading('Finding your location...');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        toast.dismiss(toastId);
        loadPlace({ lat: coords.latitude, lon: coords.longitude });
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED ? 'Location access was denied' : "Couldn't find your location";
        toast.error(message, { id: toastId });
      },
      // City-level accuracy is plenty, and a recent position can be reused
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, [loadPlace]);

  // Load the shared or last place once on start (the ref keeps StrictMode's
  // double-run in development from fetching twice)
  useEffect(() => {
    if (initialLoadStarted.current || !initialPlace) return;
    initialLoadStarted.current = true;
    loadPlace(initialPlace);
  }, [initialPlace, loadPlace]);

  return { weather, isLoading, loadPlace, locateUser, initialPlace };
}
