import React, { Component } from "react";
import MDX from "@mdx-js/runtime";

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
        <MDX>{this.props.readme}</MDX>
      </div>
    );
  }
}

export default Hook;
