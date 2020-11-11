var visit = require('unist-util-visit')

module.exports = stripBadges

function stripBadges() {
  return transformer
}

function transformer(tree) {

  visit(tree, check)

  // Remove badge images, and links that include a badge image.
  function check(node, index, parent) {
    var remove = false

    if (node.type === 'heading' && node.depth == 1) {
        remove=true
    }

    if (remove === true) {
      parent.children.splice(index, 1)
      return [visit.SKIP, index]
    }
  }
}

