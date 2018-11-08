import LiveEdit from "../components/LiveEdit";
import CodeBlock from "../components/CodeBlock";

const components = {
  h1: props => <h1 className="title" {...props} />,
  h2: props => <h2 className="subtitle" {...props} />,
  code({ children, className = "" }) {
    const language = className.replace(/language-/, "");
    if (language === "react") {
      return <LiveEdit code={children} noInline />;
    } else if (language === "react-inline") {
      return <LiveEdit code={children} />;
    } else if (language === "sh") {
      return <CodeBlock code={children} language="bash" />;
    }
    return <CodeBlock code={children} language={language} />;
  }
};

export default components;
