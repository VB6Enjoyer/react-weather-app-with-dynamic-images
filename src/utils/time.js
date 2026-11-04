// OpenWeather gives UTC timestamps and each location's offset, both in
// seconds. Shifting the timestamp by the offset makes the Date's UTC fields
// hold the location's local time, independent of the viewer's timezone.
export const toLocalDate = (timestamp, timezone) => new Date((timestamp + timezone) * 1000);

export const formatTime = (timestamp, timezone, use12Hour) => {
    if (!Number.isFinite(timestamp)) return "";

    const localTime = toLocalDate(timestamp, timezone);
    const hours = localTime.getUTCHours();
    const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");

    if (use12Hour) {
        const period = hours >= 12 ? "PM" : "AM";
        return `${hours % 12 || 12}:${minutes} ${period}`;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
};
