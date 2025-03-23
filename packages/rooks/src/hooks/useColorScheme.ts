import { useState, useEffect } from "react";

export type ColorScheme = "light" | "dark" | "no-preference";

/**
 * useColorScheme
 * @description A hook to detect user's color scheme preference
 * @returns {ColorScheme} The user's preferred color scheme
 * @see {@link https://rooks.vercel.app/docs/useColorScheme}
 *
 * @example
 *
 * const colorScheme = useColorScheme();
 * 
 * return (
 *   <div>
 *     <p>Current color scheme: {colorScheme}</p>
 *     {colorScheme === 'dark' && <DarkTheme />}
 *     {colorScheme === 'light' && <LightTheme />}
 *   </div>
 * );
 */
function useColorScheme(): ColorScheme {
    const defaultScheme: ColorScheme = "no-preference";
    const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultScheme);

    useEffect(() => {
        // Skip if not in browser environment or matchMedia not supported
        if (typeof window === "undefined" || !window.matchMedia) {
            return;
        }

        // Function to check the color scheme
        const detectColorScheme = () => {
            // Check for dark mode preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                setColorScheme("dark");
            }
            // Check for light mode preference
            else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                setColorScheme("light");
            }
            // Default to no preference
            else {
                setColorScheme("no-preference");
            }
        };

        // Initial detection
        detectColorScheme();

        // Set up listeners for changes
        const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const lightModeMediaQuery = window.matchMedia("(prefers-color-scheme: light)");

        // Modern browsers support addEventListener
        const addListener = (mediaQuery: MediaQueryList, colorScheme: ColorScheme) => {
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener("change", (e) => {
                    if (e.matches) {
                        setColorScheme(colorScheme);
                    }
                });
                return () => {
                    mediaQuery.removeEventListener("change", (e) => {
                        if (e.matches) {
                            setColorScheme(colorScheme);
                        }
                    });
                };
            }
            // For older browsers that don't support addEventListener
            else if (mediaQuery.addListener) {
                mediaQuery.addListener((e) => {
                    if (e.matches) {
                        setColorScheme(colorScheme);
                    }
                });
                return () => {
                    mediaQuery.removeListener((e) => {
                        if (e.matches) {
                            setColorScheme(colorScheme);
                        }
                    });
                };
            }
            return () => { };
        };

        // Add listeners for both dark and light mode changes
        const darkCleanup = addListener(darkModeMediaQuery, "dark");
        const lightCleanup = addListener(lightModeMediaQuery, "light");

        return () => {
            darkCleanup();
            lightCleanup();
        };
    }, []);

    return colorScheme;
}

export { useColorScheme }; 