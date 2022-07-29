import { Text } from "@nextui-org/react";
import Image from "next/image";
import {
  ComponentPropsWithoutRef,
  PropsWithRef,
  ReactElement,
  ReactNode,
} from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/dracula";
import { styled } from "@stitches/react";

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

const StyledTable = styled("table", {
  padding: "8px",
  margin: "12px 0 48px",
  width: "100%",
  borderCollapse: "collapse",
  wordBreak: "break-word",
  whiteSpace: "no-wrap",
  textAlign: "left",
  "& th,td": {
    padding: "12px 24px;",
  },
});

export const components = {
  img: ResponsiveImage,
  h1: (props: ComponentPropsWithoutRef<"h1">) => <Text h1 as="h1" {...props} />,
  h2: (props: ComponentPropsWithoutRef<"h2">) => <Text h2 as="h2" {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <Text h3 as="h3" {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <Text as="p" {...props} />,
  pre: Code,
  code: Code,
  table: StyledTable,
};
