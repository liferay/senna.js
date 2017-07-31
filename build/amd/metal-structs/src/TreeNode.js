define(['exports', 'metal/src/metal'], function (exports, _metal) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var TreeNode = function () {
		function TreeNode(value) {
			_classCallCheck(this, TreeNode);

			/**
    * The value.
    * @private {V}
    */
			this.value_ = value;

			/**
    * Reference to the parent node or null if it has no parent.
    * @private {TreeNode}
    */
			this.parent_ = null;

			/**
    * Child nodes or null in case of leaf node.
    * @private {Array<!TreeNode>}
    */
			this.children_ = null;
		}

		/**
   * Appends a child node to this node.
   * @param {!TreeNode} child Orphan child node.
   */


		_createClass(TreeNode, [{
			key: 'addChild',
			value: function addChild(child) {
				assertChildHasNoParent(child);
				child.setParent(this);
				this.children_ = this.children_ || [];
				this.children_.push(child);
			}
		}, {
			key: 'contains',
			value: function contains(node) {
				var current = node.getParent();
				while (current) {
					if (current === this) {
						return true;
					}
					current = current.getParent();
				}
				return false;
			}
		}, {
			key: 'getAncestors',
			value: function getAncestors() {
				var ancestors = [];
				var node = this.getParent();
				while (node) {
					ancestors.push(node);
					node = node.getParent();
				}
				return ancestors;
			}
		}, {
			key: 'getChildAt',
			value: function getChildAt(index) {
				return this.getChildren()[index] || null;
			}
		}, {
			key: 'getChildren',
			value: function getChildren() {
				return this.children_ || TreeNode.EMPTY_ARRAY;
			}
		}, {
			key: 'getChildCount',
			value: function getChildCount() {
				return this.getChildren().length;
			}
		}, {
			key: 'getDepth',
			value: function getDepth() {
				var depth = 0;
				var node = this;
				while (node.getParent()) {
					depth++;
					node = node.getParent();
				}
				return depth;
			}
		}, {
			key: 'getParent',
			value: function getParent() {
				return this.parent_;
			}
		}, {
			key: 'getRoot',
			value: function getRoot() {
				var root = this;
				while (root.getParent()) {
					root = root.getParent();
				}
				return root;
			}
		}, {
			key: 'getValue',
			value: function getValue() {
				return this.value_;
			}
		}, {
			key: 'isLeaf',
			value: function isLeaf() {
				return !this.getChildCount();
			}
		}, {
			key: 'removeChild',
			value: function removeChild(child) {
				if (_metal.array.remove(this.getChildren(), child)) {
					return child;
				}
				return null;
			}
		}, {
			key: 'setParent',
			value: function setParent(parent) {
				this.parent_ = parent;
			}
		}, {
			key: 'traverse',
			value: function traverse(opt_preorderFn, opt_postorderFn) {
				if (opt_preorderFn) {
					opt_preorderFn(this);
				}
				this.getChildren().forEach(function (child) {
					return child.traverse(opt_preorderFn, opt_postorderFn);
				});
				if (opt_postorderFn) {
					opt_postorderFn(this);
				}
			}
		}]);

		return TreeNode;
	}();

	/**
  * Constant for empty array to avoid unnecessary allocations.
  * @private
  */
	TreeNode.EMPTY_ARRAY = [];

	/**
  * Asserts that child has no parent.
  * @param {TreeNode} child A child.
  * @private
  */
	var assertChildHasNoParent = function assertChildHasNoParent(child) {
		if (child.getParent()) {
			throw new Error('Cannot add child with parent.');
		}
	};

	exports.default = TreeNode;
});
//# sourceMappingURL=TreeNode.js.map
