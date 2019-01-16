import React, { Component, Suspense } from "react";
import { ThemeProvider } from "styled-components";
import PropTypes from "prop-types";
import NoSSR from "react-no-ssr";
import ScopeWithHook from "../components/scope-with-hook";
import getReadme from "../actions/getReadme";
import mdxComponents from "../utils/mdx-components";
import hookMap from "../utils/getHookMap";
import readmeMap from "../utils/getReadmeMap";
import BoundlingClientReadme from "@rooks/use-boundingclientrect/README.md";

class ReadmeComponent extends Component {
  render() {
    const MyComponent = readmeMap[this.props.hookName];
    if (!MyComponent) {
      return null;
    }
    return (
      <ScopeWithHook hookName={this.props.hookName} hookMap={hookMap}>
        <section className="section">
          <ThemeProvider
            theme={{
              h3Color: "gold"
            }}
          >
            {React.createElement(BoundlingClientReadme, {
              ...this.props
            })}
          </ThemeProvider>
        </section>
      </ScopeWithHook>
    );
  }
}

class Hook extends Component {
  static async getInitialProps({ query: { hookName }, ...rest }) {
    return { hookName };
  }
  render() {
    const { hookName } = this.props;
    return (
      <div>
        <div className="container is-fluid">
          <ReadmeComponent hookName={hookName} components={mdxComponents} />
        </div>
      </div>
    );
  }
}

export default Hook;
