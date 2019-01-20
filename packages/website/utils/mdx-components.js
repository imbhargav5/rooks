import LiveEdit from "../components/LiveEdit";
import CodeBlock from "../components/CodeBlock";
import Table from "../components/Table";
import { H1, H2, H3 } from "../components/Headings";

const components = {
  h1: props => <H1 {...props} />,
  h2: props => <H2 {...props} />,
  h3: props => <H3 {...props} />,
  code({ children, className = "" }) {
    const language = className.replace(/language-/, "");
    if (language === "jsx") {
      return <LiveEdit code={children} noInline />;
    } else if (language === "react-inline") {
      return <LiveEdit code={children} />;
    } else if (language === "react") {
      return <CodeBlock code={children} language="jsx" />;
    } else if (language === "sh") {
      return <CodeBlock code={children} language="bash" />;
    }
    return <CodeBlock code={children} language={language} />;
  },
  table: props => <Table {...props} />
};

export default components;
