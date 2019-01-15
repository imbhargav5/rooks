import React, { Component, Suspense } from "react";
import { ThemeProvider } from "styled-components";
import PropTypes from "prop-types";
import NoSSR from "react-no-ssr";
import ScopeWithHook from "../components/scope-with-hook";
import getReadme from "../actions/getReadme";
import mdxComponents from "../utils/mdx-components";
import hookMap from "../utils/getHookMap";
import BoundlingClientReadme from "@rooks/use-boundingclientrect/README.md";

console.log(hookMap);

class ReadmeComponent extends Component {
  static propTypes = {
    hookName: PropTypes.string,
    components: PropTypes.object
  };
  state = {
    loaded: false
  };
  async componentDidMount() {
    const { hookName } = this.props;
    try {
      const [readmeComponent] = await Promise.all([
        import(`@rooks/use-${hookName}/README.md`)
      ]);

      console.log(readmeComponent);
      this.readmeComponent = readmeComponent.default || readmeComponent;
      console.log(this.readmeComponent);
      this.setState({
        loaded: true
      });
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    console.log(this.readmeComponent);
    if (this.state.loaded) {
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
    return null;
  }
}

class Hook extends Component {
  static async getInitialProps({ query: { hookName }, ...rest }) {
    console.log({ hookName });
    return { hookName };
  }
  render() {
    const { hookName } = this.props;
    console.log({ hookName });
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
