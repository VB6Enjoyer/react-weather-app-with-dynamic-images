import { useEffect, useState } from 'react';
import { readStored, writeStored } from '../utils/storage';

// useState that survives reloads. allowedValues guards against outdated or
// edited stored values by falling back to the default.
export default function useStoredState(key, fallback, allowedValues) {
  const [value, setValue] = useState(() =>
    readStored(key, fallback, (stored) => !allowedValues || allowedValues.includes(stored))
  );

  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue];
}
