import React, { Component } from "react";

class Hook extends Component {
  static async getInitialProps({ query: { hookName }, ...rest }) {
    return {
      hookName
    };
  }
  render() {
    return <div>{this.props.hookName}</div>;
  }
}

export default Hook;
