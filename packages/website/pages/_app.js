import React from "react";
import App, { Container } from "next/app";
import { createGlobalStyle } from "styled-components";
import Layout from "../components/common/Layout";
import { HookNamesContext } from "../utils/contexts";

const GlobalStyles = createGlobalStyle`
    html, body{
        font-family: 'Source Code Pro', monospace;
        font-size: 16px;
    }
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    let hookNames = [];
    if (!process.browser) {
      const { getHookNames } = require("../utils/getAllHooks");
      hookNames = getHookNames();
    }
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, hookNames };
  }

  render() {
    const { Component, pageProps, hookNames } = this.props;

    return (
      <Container>
        <HookNamesContext.Provider value={hookNames}>
          <GlobalStyles />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </HookNamesContext.Provider>
      </Container>
    );
  }
}
