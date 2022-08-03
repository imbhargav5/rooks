import { globalCss, NextUIProvider } from "@nextui-org/react";
import { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { components } from "../components/MDXRenderer/components";

const globalStyles = globalCss({
  "*": { margin: 0, padding: 0, boxSizing: "border-box" },
  mark: {
    backgroundColor: "lightblue",
    padding: "2px 6px",
    fontWeight: 500,
    borderRadius: 6,
  },
  hr: {
    border: "1px solid $gray-300",
    margin: "1rem 0",
  },
  br: {
    display: "block",
    content: "",
    margin: "1rem 0",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    // 2. Use at the root of your app
    <MDXProvider components={components}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </MDXProvider>
  );
}

export default MyApp;
