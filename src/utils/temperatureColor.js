const COLDEST = -10; // °C, shown fully blue
const HOTTEST = 40; // °C, shown fully red

// Maps a Celsius temperature to a color from blue (cold) through cyan,
// green and yellow to red (hot). Works on Celsius so the color stays the
// same whichever unit is displayed.
export default function temperatureColor(celsius) {
    const clamped = Math.max(COLDEST, Math.min(HOTTEST, celsius));
    const ratio = (clamped - COLDEST) / (HOTTEST - COLDEST);

    let r, g, b;

    if (ratio < 0.25) { // Cold: Blue → Cyan
        r = 0;
        g = Math.round(255 * (ratio / 0.25));
        b = 255;
    } else if (ratio < 0.5) { // Cool: Cyan → Green
        r = 0;
        g = 255;
        b = Math.round(255 * (1 - (ratio - 0.25) / 0.25));
    } else if (ratio < 0.75) { // Warm: Green → Yellow → Orange
        r = Math.round(255 * ((ratio - 0.5) / 0.25));
        g = 255;
        b = 0;
    } else { // Hot: Orange → Red
        r = 255;
        g = Math.round(255 * (1 - (ratio - 0.75) / 0.25));
        b = 0;
    }

    return `rgb(${r}, ${g}, ${b})`;
}
