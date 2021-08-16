"use strict";

import findAllBetween from "unist-util-find-all-between";
import findAllBefore from "unist-util-find-all-before";
import findAllAfter from "unist-util-find-all-after";
import visit from "unist-util-visit";
import find from "unist-util-find";

export default function (options) {
  const settings = options || {};

  function transform(node) {
    if (settings.depth && isNaN(settings.depth)) {
      throw new Error("Expected a `number` to change depth by.");
    } else if (settings.depth && node.type === "heading") {
      const depth = node.depth + settings.depth;
      if (depth > 6) {
        node.depth = 6;
      } else if (depth <= 0) {
        node.depth = 1;
      } else {
        node.depth = depth;
      }
    }
    return node;
  }

  function getNode(tree, value) {
    if (typeof value === "string") {
      return find(tree, { type: "heading", children: [{ value }] });
    }
    if (typeof value === "number") {
      return tree.children[value];
    }
    return find(tree, value);
  }

  function transformer(tree) {
    const testFn: any = (n) => {
      return transform(n);
    };
    if (settings.after || settings.after === 0) {
      findAllAfter(tree, getNode(tree, settings.after), testFn);
    } else if (settings.before) {
      findAllBefore(tree, getNode(tree, settings.before), testFn);
    } else if (settings.between) {
      findAllBetween(
        tree,
        tree.children.indexOf(getNode(tree, settings.between[0])),
        getNode(tree, settings.between[1]),
        testFn
      );
    } else {
      visit(tree, testFn);
    }
  }
  return transformer;
}
