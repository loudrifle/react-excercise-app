/**
 * useLocalStorage
 *
 * Drop-in replacement for useState that persists the value in localStorage.
 *
 * Design decisions:
 * - Lazy initializer: localStorage is read only once on mount via the function
 *   passed to useState(() => ...), not on every render.
 * - setValue uses the functional update pattern (prev => ...) to guarantee
 *   atomicity: it reads the latest state even if called in rapid succession.
 * - useCallback stabilizes the setValue reference: consumers receiving it as a
 *   prop or effect dependency won't re-render unnecessarily.
 * - try/catch handles environments without localStorage (e.g. iframes, privacy mode).
 */
import { useState, useCallback } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          console.warn(`useLocalStorage: failed to write key "${key}"`);
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
