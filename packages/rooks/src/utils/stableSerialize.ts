function stableSerializeValue(value: unknown, seen: WeakSet<object>): string {
  if (value === null || typeof value !== "object") {
    if (typeof value === "bigint") {
      return `bigint:${String(value)}`;
    }
    if (typeof value === "function" || typeof value === "symbol") {
      return `${typeof value}:${String(value)}`;
    }

    return JSON.stringify(value) ?? String(value);
  }

  if (value instanceof Date) {
    return `date:${value.toISOString()}`;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return `[${value
      .map((item) => stableSerializeValue(item, seen))
      .join(",")}]`;
  }

  const entries = Object.entries(value).sort(([first], [second]) =>
    first.localeCompare(second)
  );
  return `{${entries
    .map(
      ([key, entryValue]) =>
        `${JSON.stringify(key)}:${stableSerializeValue(entryValue, seen)}`
    )
    .join(",")}}`;
}

export function stableSerialize(value: unknown): string {
  return stableSerializeValue(value, new WeakSet());
}
