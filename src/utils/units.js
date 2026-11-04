// The API returns Celsius and metres per second; these convert for display

export const TEMPERATURE_UNITS = ["°C", "°F", "K"];
export const SPEED_UNITS = ["KM/h", "M/h"];

export const convertTemperature = (celsius, unit) => {
    if (unit === "°F") return celsius * 9 / 5 + 32;
    if (unit === "K") return celsius + 273.15;
    return celsius;
};

export const convertSpeed = (metresPerSecond, unit) =>
    metresPerSecond * (unit === "M/h" ? 2.23694 : 3.6);

// Next unit when the user clicks the temperature or wind card
export const nextUnit = (units, current) => units[(units.indexOf(current) + 1) % units.length];
