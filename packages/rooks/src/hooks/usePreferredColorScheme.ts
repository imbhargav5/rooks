import { useSyncExternalStore } from "use-sync-external-store/shim";
import { noop } from "@/utils/noop";

/**
 * Color scheme preference
 */
type ColorScheme = "light" | "dark" | "no-preference";

/**
 * Return value for the usePreferredColorScheme hook
 */
interface UsePreferredColorSchemeReturnValue {
  /**
   * The preferred color scheme (light, dark, or no-preference)
   */
  colorScheme: ColorScheme | null;
  /**
   * Whether the preferred color scheme is dark
   */
  isDark: boolean;
  /**
   * Whether the preferred color scheme is light
   */
  isLight: boolean;
}

/**
 * Get the current color scheme preference
 */
function getColorScheme(): ColorScheme | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "no-preference";
}

/**
 * Subscribe to color scheme changes
 */
function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    console.warn("usePreferredColorScheme: window is undefined.");
    return noop;
  }

  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const lightModeQuery = window.matchMedia("(prefers-color-scheme: light)");

  // Modern browsers support addEventListener on MediaQueryList
  if (darkModeQuery.addEventListener) {
    darkModeQuery.addEventListener("change", onStoreChange);
    lightModeQuery.addEventListener("change", onStoreChange);

    return () => {
      darkModeQuery.removeEventListener("change", onStoreChange);
      lightModeQuery.removeEventListener("change", onStoreChange);
    };
  } else {
    // Fallback for older browsers using addListener
    // @ts-ignore - addListener exists in older browsers
    darkModeQuery.addListener(onStoreChange);
    // @ts-ignore
    lightModeQuery.addListener(onStoreChange);

    return () => {
      // @ts-ignore
      darkModeQuery.removeListener(onStoreChange);
      // @ts-ignore
      lightModeQuery.removeListener(onStoreChange);
    };
  }
}

/**
 * usePreferredColorScheme hook
 *
 * Detect and track the user's preferred color scheme (dark mode or light mode).
 * Automatically updates when the user changes their system preference.
 *
 * @returns Object containing color scheme information
 *
 * @example
 * ```tsx
 * import { usePreferredColorScheme } from "rooks";
 *
 * function ThemeAwareComponent() {
 *   const { colorScheme, isDark, isLight } = usePreferredColorScheme();
 *
 *   return (
 *     <div style={{
 *       backgroundColor: isDark ? "#000" : "#fff",
 *       color: isDark ? "#fff" : "#000"
 *     }}>
 *       <h1>Current theme: {colorScheme}</h1>
 *       <p>Dark mode is {isDark ? "enabled" : "disabled"}</p>
 *       <p>Light mode is {isLight ? "enabled" : "disabled"}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/usePreferredColorScheme
 */
function usePreferredColorScheme(): UsePreferredColorSchemeReturnValue {
  const colorScheme = useSyncExternalStore<ColorScheme | null>(
    subscribe,
    getColorScheme,
    () => null // Server-side snapshot
  );

  return {
    colorScheme,
    isDark: colorScheme === "dark",
    isLight: colorScheme === "light",
  };
}

export { usePreferredColorScheme };
export type { UsePreferredColorSchemeReturnValue, ColorScheme };
