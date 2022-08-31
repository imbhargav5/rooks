import { Spacer, Text } from "@nextui-org/react";
import Image from "next/image";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  PropsWithRef,
  ReactElement,
  ReactNode,
} from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/dracula";
import { styled } from "@stitches/react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { MDXProvider } from "@mdx-js/react";
import {
  FirstLevelHeadline,
  SecondLevelHeadline,
  ThirdLevelHeadlineOverline,
} from "../Headings";

const ResponsiveImage = ({
  alt,
  src,
}: Partial<Pick<PropsWithRef<HTMLImageElement>, "src" | "alt">>) => {
  if (src) {
    return (
      <Image
        alt={alt ?? "image"}
        src={src}
        layout="responsive"
        width="400"
        height="300"
      />
    );
  } else {
    return null;
  }
};

function Code({ children }: { children?: ReactNode }) {
  const children2 = children as ReactElement | undefined | null;
  if (!children2) {
    return null;
  }
  const { props } = children2;
  if (!props) {
    return null;
  }
  const code = props.children;
  const language = (props.className || "").replace(/language-/, "");

  if (language === "javascript" || language === "jsx") {
    return (
      <div>
        <Spacer y={0.5} />
        <CustomSandpack>
          <Sandpack
            template="react"
            files={{
              "/App.js": code,
            }}
            theme="dark"
            options={{
              showLineNumbers: true,
              editorHeight: 350,
              editorWidthPercentage: 60,
              showConsoleButton: code.match(/console\./gm),
              showConsole: code.match(/console\./gm),
            }}
            customSetup={{
              dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
                "react-is": "^18.2.0",
                rooks: "latest",
                random: "latest",
                "styled-components": "latest",
                "framer-motion": "latest",
              },
            }}
          />
        </CustomSandpack>
        <Spacer y={2} />
      </div>
    );
  } else {
    return (
      <Highlight
        {...defaultProps}
        theme={theme}
        code={code}
        language={language as "jsx"}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    );
  }
}

const CustomSandpack = styled("div", {
  pre: { fontSize: "11.5px" },
  code: { fontSize: "11.5px", background: "none", padding: 0 },
});

const StyledTable = styled("table", {
  padding: "8px",
  margin: "12px 0 48px",
  width: "100%",
  borderRadius: 15,
  border: "2px solid black",
  borderCollapse: "collapse",
  textAlign: "left",
  "& th,td": {
    border: "1px solid black",
    padding: "12px 24px;",
  },
});

export const components: ComponentProps<typeof MDXProvider>["components"] = {
  img: ResponsiveImage,
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <FirstLevelHeadline {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <SecondLevelHeadline {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <ThirdLevelHeadlineOverline h3 as="h3" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => <Text as="p" {...props} />,
  pre: Code,
  table: StyledTable,
};
