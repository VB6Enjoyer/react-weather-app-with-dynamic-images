import "./WeatherSearch.css";
import { useState } from "react";

function WeatherSearch({ fetchData }) {
    const [search, setSearch] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        if (search.trim != "") {
            fetchData(search);
        } else {
            console.error("No input value was specified.");
            return;
        }
    }

    return (
        <form id="weather-search" onSubmit={(e) => handleSearch(e)}>
            <input id="search-bar" type="text" placeholder="Location" onChange={(e) => setSearch(e.target.value)}></input>
            <button id="search-button">Search</button>
        </form>
    )
}

export default WeatherSearch;
