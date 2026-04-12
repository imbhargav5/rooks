import type { MutableRefObject } from "react";
import { useRef } from "react";

/**
 * useLatest
 *
 * Returns a ref that always holds the latest value passed to it, solving
 * the stale closure problem. Unlike useFreshRef, the ref is updated
 * synchronously during render rather than in an effect, so it is always
 * current—even during the same render cycle.
 *
 * @param value The value to keep fresh inside the ref
 * @returns A MutableRefObject whose .current is always the latest value
 * @see https://rooks.vercel.app/docs/hooks/useLatest
 *
 * @example
 * // Solve stale closures in event listeners / intervals
 * function SearchInput() {
 *   const [query, setQuery] = useState("");
 *   const latestQuery = useLatest(query);
 *
 *   useEffect(() => {
 *     const id = setInterval(() => {
 *       // latestQuery.current is always the latest query,
 *       // even though the effect only ran once.
 *       console.log("current query:", latestQuery.current);
 *     }, 1000);
 *     return () => clearInterval(id);
 *   }, []); // empty deps — no stale closure
 *
 *   return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
 * }
 */
function useLatest<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export { useLatest };
