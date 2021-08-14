import { Node } from "unist";
import visit, { Visitor } from "unist-util-visit";

export default function stripBadges() {
  return transformer;
}

function transformer(tree: Node) {
  // Remove badge images, and links that include a badge image.
  let check: Visitor<Node> = function (node, index, parent) {
    var remove = false;

    if (node.type === "heading" && node.depth == 1) {
      remove = true;
    }

    if (remove === true) {
      parent?.children.splice(index, 1);
      return [visit.SKIP, index];
    }
  };

  visit(tree, check);
}
