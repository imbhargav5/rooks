import React from "react";
import NoSSR from "react-no-ssr";
import HomePageReadme from "../components/HomePage.md";
import mdxComponents from "../utils/mdx-components";

export default () => (
  <>
    <HomePageReadme components={mdxComponents} />
  </>
);
