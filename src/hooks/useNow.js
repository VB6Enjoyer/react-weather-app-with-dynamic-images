import { useEffect, useState } from 'react';

const nowInSeconds = () => Math.floor(Date.now() / 1000);

// Current Unix time in seconds, updated at the start of every minute so a
// clock showing hours and minutes changes exactly when the minute does
export default function useNow() {
  const [now, setNow] = useState(nowInSeconds);

  useEffect(() => {
    let timeoutId;

    const scheduleNextTick = () => {
      const msUntilNextMinute = 60000 - (Date.now() % 60000);
      timeoutId = setTimeout(() => {
        setNow(nowInSeconds());
        scheduleNextTick();
      }, msUntilNextMinute + 50); // Small margin so the tick lands after the boundary
    };

    scheduleNextTick();
    return () => clearTimeout(timeoutId);
  }, []);

  return now;
}
