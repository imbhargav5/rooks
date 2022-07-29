import fromMarkdown from "mdast-util-from-markdown";
import compact from "mdast-util-compact";
import toMarkdown from "mdast-util-to-markdown";
import normalizeHeadings from "mdast-normalize-headings";
import strip from "remark-strip-badges";
import remark from "remark";
import behead from "remark-behead";
import transformHeadings from "./transform-headings";
import removeTopHeading from "./remove-top-heading";
import { Buffer } from "micromark/dist/shared-types";

export default function parseReadme(readmeContent: string | Buffer) {
  try {
    var tree = fromMarkdown(readmeContent);
    tree = compact(tree);
    tree = normalizeHeadings(tree);
    let md: any = toMarkdown(tree);
    md = remark()
      .use(strip)
      .use(removeTopHeading)
      //.use(behead, { before: "Installation", depth: 1 })
      //.use(transformHeadings, {before: "Installation"})
      .processSync(md);
    return md;
  } catch (err) {
    console.log("ERROR in readme parse", err);
    return readmeContent;
  }
}
