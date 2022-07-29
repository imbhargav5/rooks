import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { components } from "./components";

export const MDXRenderer = ({
  mdxSource,
}: {
  mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, string>
  >;
}) => {
  return <MDXRemote {...mdxSource} components={components} />;
};
