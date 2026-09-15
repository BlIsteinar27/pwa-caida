import { useState, useEffect, useRef } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs: number = 500
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const timeoutRef = useRef<number | null>(null);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Clear previous timeout
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      // Debounce the localStorage write
      timeoutRef.current = window.setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error saving ${key} to localStorage:`, error);
        }
      }, debounceMs);
    } catch (error) {
      console.error(`Error setting ${key} state:`, error);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [storedValue, setValue];
}
