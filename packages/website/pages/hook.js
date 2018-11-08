import React, { Component } from "react";
import MDX from "@mdx-js/runtime";
import mdxComponents from "../utils/mdx-components";

class Hook extends Component {
  static async getInitialProps({ query: { hookName }, ...rest }) {
    let readme = "";
    if (!process.browser) {
      try {
        const { getReadme } = require("../utils/getHook");
        readme = getReadme(hookName);
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
        <section className="section">
          <div className="container is-fluid">
            <MDX components={mdxComponents}>{this.props.readme}</MDX>
          </div>
        </section>
      </div>
    );
  }
}

export default Hook;
