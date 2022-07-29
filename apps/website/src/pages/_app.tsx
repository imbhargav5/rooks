import { NextUIProvider } from "@nextui-org/react";
import { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { components } from "../components/MDXRenderer/components";

function MyApp({ Component, pageProps }: AppProps) {
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
