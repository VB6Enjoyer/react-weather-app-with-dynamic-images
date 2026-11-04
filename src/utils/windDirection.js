const DIRECTIONS = [
    { label: "N", arrow: "⬆️" },
    { label: "NE", arrow: "↗️" },
    { label: "E", arrow: "➡️" },
    { label: "SE", arrow: "↘️" },
    { label: "S", arrow: "⬇️" },
    { label: "SW", arrow: "↙️" },
    { label: "W", arrow: "⬅️" },
    { label: "NW", arrow: "↖️" },
];

// Compass point for a wind direction in degrees, or null if unknown. Each
// point covers 45°; a value exactly on a boundary (22.5°, 67.5°...) belongs
// to the point before it.
export default function windDirection(degrees) {
    if (!Number.isFinite(degrees)) return null;

    const normalized = ((degrees % 360) + 360) % 360;
    const index = Math.ceil(normalized / 45 - 0.5) % DIRECTIONS.length;
    return DIRECTIONS[index];
}
