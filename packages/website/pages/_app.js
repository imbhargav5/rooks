import React from "react";
import App, { Container } from "next/app";
import { createGlobalStyle } from "styled-components";
import Layout from "../components/common/Layout";

const GlobalStyles = createGlobalStyle`
    html, body{
        font-family: 'Source Code Pro', monospace;
    }
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <GlobalStyles />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    );
  }
}
