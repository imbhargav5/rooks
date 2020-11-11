'use strict';

const findAllBetween = require('unist-util-find-all-between');
const findAllBefore = require('unist-util-find-all-before');
const findAllAfter = require('unist-util-find-all-after');
const visit = require('unist-util-visit');
const find = require('unist-util-find');

module.exports = function (options) {
    const settings = options || {};

	function transform(node) {
		if (settings.depth && isNaN(settings.depth)) {
			throw new Error('Expected a `number` to change depth by.');
		} else if (settings.depth && node.type === 'heading') {
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
		if (typeof value === 'string') {
			return find(tree, {type: 'heading', children: [{value}]});
		}
		if (typeof value === 'number') {
			return tree.children[value];
		}
		return find(tree, value);
	}

	function transformer(tree) {
		if (settings.after || settings.after === 0) {
			findAllAfter(tree, getNode(tree, settings.after), n => {
				return transform(n);
			});
		} else if (settings.before) {
			findAllBefore(tree, getNode(tree, settings.before), n => {
				return transform(n);
			});
		} else if (settings.between) {
			findAllBetween(
				tree,
				tree.children.indexOf(getNode(tree, settings.between[0])),
				getNode(tree, settings.between[1]),
				n => {
					return transform(n);
				}
			);
		} else {
			visit(tree, n => {
				return transform(n);
			});
		}
    }
    return transformer
}