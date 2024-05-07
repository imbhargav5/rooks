import { useState } from "react";

/**
 * Call the passed function once in the component lifecycle,
 * 
 * unlike `useMemo` that even when you pass empty deps it might
 * 
 * call your callback again (check last sentence in {@link https://legacy.reactjs.org/docs/hooks-reference.html#usememo react docs}),
 * 
 * that's why some libraries use `useState` to call function once in the component lifecycle
 * 
 * @param {() => T} cb Callback that's going to be called once in the component lifecycle
 * @returns {T} The result from your callback
 * @see {@link https://rooks.vercel.app/docs/useCallOnce}
 * @example
 * ```tsx
 * import { useCallOnce } from "rooks";
 * 
 * export default function App() {
 *   // `socket-io.client`
 *   const socket = useCallOnce(() => io("https://my-server.com/"));
 * 
 *   // `@tanstack/react-query`
 *   const queryClient = useCallOnce(() => new QueryClient());
 * 
 *   // initialize stuff for once in the App lifecycle
 *   useCallOnce(() => init());
 * }
 * ```
*/
function useCallOnce<T>(cb: () => T): T {
  return useState(cb)[0];
}

export { useCallOnce };
