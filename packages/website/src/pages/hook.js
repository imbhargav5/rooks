import React, { Component, Suspense } from "react";
import MDX from "@mdx-js/runtime";
import { ThemeProvider } from "styled-components";
import dynamic from "next/dynamic";
import NoSSR from "react-no-ssr";
import ScopeWithHook from "../components/scope-with-hook";
import getReadme from "../actions/getReadme";
import mdxComponents from "../utils/mdx-components";

class Hook extends Component {
  static async getInitialProps({ query: { hookName }, ...rest }) {
    let readme = "";
    let scope = {};
    if (typeof window === "undefined") {
      try {
        readme = await getReadme(hookName);
      } catch (err) {
        console.log(err);
      }
    }
    return {
      hookName,
      readme
    };
  }
  render() {
    return (
      <div>
        <div className="container is-fluid">
          <NoSSR>
            <Suspense fallback={"Loading..."}>
              <ScopeWithHook hookName={this.props.hookName}>
                <section className="section">
                  <ThemeProvider
                    theme={{
                      h3Color: "gold"
                    }}
                  >
                    <MDX components={mdxComponents}>{this.props.readme}</MDX>
                  </ThemeProvider>
                </section>
              </ScopeWithHook>
            </Suspense>
          </NoSSR>
        </div>
      </div>
    );
  }
}

export default Hook;
