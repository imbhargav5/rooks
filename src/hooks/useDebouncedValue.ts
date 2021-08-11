import { useEffect, useState } from "react";

function useDebouncedValue<T = unknown>(value: T, timeout: number) {
  const [updatedValue, setUpdatedValue] = useState<T | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpdatedValue(value);
    }, timeout);

    return () => clearTimeout(timer);
  }, [value, timeout]);

  return updatedValue;
}

export { useDebouncedValue };
