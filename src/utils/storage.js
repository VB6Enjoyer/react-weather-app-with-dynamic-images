// localStorage can be unavailable (private browsing, blocked site data) or
// hold outdated values, so reads fall back to a default and writes are best
// effort; the app works the same without it, it just won't remember
export const readStored = (key, fallback, isValid = () => true) => {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;

        const value = JSON.parse(raw);
        return isValid(value) ? value : fallback;
    } catch {
        return fallback;
    }
};

export const writeStored = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage unavailable or full: nothing to do
    }
};
