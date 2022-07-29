// const withTM = require("next-transpile-modules")(["rooks"]);
import tm from "next-transpile-modules";
import nextMdx from "@next/mdx";
import remarkGfm from "remark-gfm";
const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

const withTM = tm(["rooks"]);

const config = withTM({
  reactStrictMode: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
});

export default withMDX({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  ...config,
});
