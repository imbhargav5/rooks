import React from "react";
import App, { Container } from "next/app";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { createGlobalStyle } from "styled-components";
import Layout from "../components/common/Layout";
import { HookNamesContext, NpmBlobContext } from "../utils/contexts";

library.add(faArrowRight);

const GlobalStyles = createGlobalStyle`
    html, body{
        font-family: 'Source Code Pro', monospace;
        font-size: 16px;
    }
    button, input, textarea{
        -webkit-appearance: none;
        align-items: center;
        border: 1px solid transparent;
        border-radius: 4px;
        box-shadow: none;
        display: inline-flex;
        font-size: 1rem;
        height: 2.25em;
        justify-content: flex-start;
        line-height: 1.5;
        padding-bottom: calc(0.375em - 1px);
        padding-left: calc(0.625em - 1px);
        padding-right: calc(0.625em - 1px);
        padding-top: calc(0.375em - 1px);
        position: relative;
        vertical-align: top;
    }
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    let hookNames = [];
    let npmBlob = [];
    if (!process.browser) {
      const { getHookNames } = require("../utils/getAllHooks");
      hookNames = await getHookNames();

      const { getNpmBlob } = require("../utils/getNpmBlob");
      npmBlob = await getNpmBlob();
    }
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, hookNames, npmBlob };
  }

  render() {
    const { Component, pageProps, hookNames, npmBlob } = this.props;

    return (
      <Container>
        <HookNamesContext.Provider value={hookNames}>
          <NpmBlobContext.Provider value={npmBlob}>
            <GlobalStyles />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NpmBlobContext.Provider>
        </HookNamesContext.Provider>
      </Container>
    );
  }
}
