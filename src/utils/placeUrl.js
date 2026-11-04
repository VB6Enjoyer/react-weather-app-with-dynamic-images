// Places are shared through the URL: ?q=Concordia for typed searches, or
// ?lat=-31.39&lon=-58.02&name=Concordia for suggestions and geolocation

// Two decimals (about 1 km) is plenty for weather and avoids putting a
// precise geolocated position in a link someone might share
const roundCoordinate = (value) => Math.round(value * 100) / 100;

export const placeToSearch = (place, resolvedName) => {
    const params = place.query != null
        ? { q: place.query.trim() }
        : { lat: roundCoordinate(place.lat), lon: roundCoordinate(place.lon), name: place.label || resolvedName };

    return `?${new URLSearchParams(params)}`;
};

// Returns a place for fetchWeatherData, or null if the string has none
export const placeFromSearch = (search) => {
    const params = new URLSearchParams(search);

    const query = params.get("q")?.trim();
    if (query) return { query };

    const lat = Number.parseFloat(params.get("lat"));
    const lon = Number.parseFloat(params.get("lon"));
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return { lat, lon, label: params.get("name") || undefined };
    }

    return null;
};

export const placeLabel = (place) => place?.query ?? place?.label ?? "";
