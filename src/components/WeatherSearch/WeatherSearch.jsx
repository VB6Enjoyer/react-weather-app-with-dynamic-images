import "./WeatherSearch.css";
import { useState } from "react";

function WeatherSearch({ fetchData, isLoading }) {
    const [search, setSearch] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        // Empty input is validated (with a toast) by fetchData itself
        fetchData(search);
    }

    return (
        <form id="weather-search" onSubmit={(e) => handleSearch(e)}>
            <input id="search-bar" type="text" placeholder="Location" onChange={(e) => setSearch(e.target.value)}></input>
            <button id="search-button" type="submit" disabled={isLoading}>Search</button>
        </form>
    )
}

export default WeatherSearch;
