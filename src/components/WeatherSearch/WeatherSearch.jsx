import "./WeatherSearch.css";
import { useEffect, useId, useRef, useState } from "react";
import { isRequestCancelled, searchCities } from "../../api/openWeather";

const MIN_QUERY_LENGTH = 2;
const SUGGESTION_DELAY_MS = 300;

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const cityLabel = (city) => city.local_names?.en || city.name;

// "Entre Ríos, Argentina": tells apart places that share a name
const cityRegion = (city) =>
    [city.state, regionNames.of(city.country) || city.country].filter(Boolean).join(", ");

// The geocoding API can return the same place more than once
const uniqueCities = (cities) => {
    const seen = new Set();
    return cities.filter((city) => {
        const key = `${cityLabel(city)}|${city.state}|${city.country}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

function WeatherSearch({ fetchData, isLoading }) {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const listId = useId();
    // Only typing turns lookups on; searching or picking a suggestion turns
    // them off, so a pending lookup can't reopen the list afterwards
    const lookupEnabled = useRef(false);

    // Debounced suggestion lookup; typing again cancels the pending request
    useEffect(() => {
        if (!lookupEnabled.current) return;

        const query = search.trim();
        if (query.length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            if (!lookupEnabled.current) return; // Searched before the delay ran out

            try {
                const cities = await searchCities(query, { signal: controller.signal });
                if (!lookupEnabled.current) return;

                setSuggestions(uniqueCities(cities));
                setActiveIndex(-1);
                setIsOpen(true);
            } catch (error) {
                if (!isRequestCancelled(error)) console.error("Error fetching suggestions:", error);
            }
        }, SUGGESTION_DELAY_MS);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [search]);

    const closeSuggestions = () => {
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const selectCity = (city) => {
        const label = cityLabel(city);

        lookupEnabled.current = false;
        setSearch(label);
        setSuggestions([]);
        closeSuggestions();

        // Coordinates pin down the exact place; the label replaces the
        // weather station name the API would otherwise show
        fetchData({ lat: city.lat, lon: city.lon, label });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (isLoading) return;

        if (isOpen && activeIndex >= 0) {
            selectCity(suggestions[activeIndex]);
            return;
        }

        lookupEnabled.current = false;
        closeSuggestions();
        // Empty input is validated (with a toast) by fetchData itself
        fetchData({ query: search });
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            if (suggestions.length === 0) return;
            e.preventDefault();

            const step = e.key === "ArrowDown" ? 1 : -1;
            setIsOpen(true);
            setActiveIndex((index) => (index + step + suggestions.length) % suggestions.length);
        } else if (e.key === "Escape") {
            closeSuggestions();
        }
    };

    const showSuggestions = isOpen && suggestions.length > 0;
    const optionId = (index) => `${listId}-option-${index}`;

    return (
        <form id="weather-search" role="search" onSubmit={handleSearch}>
            <div id="search-field">
                <input
                    id="search-bar"
                    type="text"
                    placeholder="Location"
                    aria-label="Location"
                    enterKeyHint="search"
                    autoComplete="off"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions}
                    aria-controls={listId}
                    aria-activedescendant={showSuggestions && activeIndex >= 0 ? optionId(activeIndex) : undefined}
                    value={search}
                    onChange={(e) => {
                        lookupEnabled.current = true;
                        setSearch(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    onBlur={closeSuggestions}
                />

                {showSuggestions && (
                    <ul id={listId} role="listbox" aria-label="Suggested locations" className="suggestions">
                        {suggestions.map((city, index) => (
                            <li
                                key={`${city.lat},${city.lon}`}
                                id={optionId(index)}
                                role="option"
                                aria-selected={index === activeIndex}
                                className={index === activeIndex ? "suggestion active" : "suggestion"}
                                // Keep focus in the input so the click isn't lost to onBlur
                                onMouseDown={(e) => e.preventDefault()}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => selectCity(city)}
                            >
                                <span className="suggestion-name">{cityLabel(city)}</span>
                                <span className="suggestion-region">{cityRegion(city)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button id="search-button" type="submit" disabled={isLoading}>Search</button>
        </form>
    )
}

export default WeatherSearch;