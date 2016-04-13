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

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	/**
  * A cached reference to the create function.
  */
	var create = Object.create;

	/**
  * Case insensitive string Multimap implementation. Allows multiple values for
  * the same key name.
  * @extends {Disposable}
  */

	var MultiMap = function (_Disposable) {
		_inherits(MultiMap, _Disposable);

		function MultiMap() {
			_classCallCheck(this, MultiMap);

			var _this = _possibleConstructorReturn(this, _Disposable.call(this));

			_this.keys = create(null);
			_this.values = create(null);
			return _this;
		}

		/**
   * Adds value to a key name.
   * @param {string} name
   * @param {*} value
   * @chainable
   */


		MultiMap.prototype.add = function add(name, value) {
			this.keys[name.toLowerCase()] = name;
			this.values[name.toLowerCase()] = this.values[name.toLowerCase()] || [];
			this.values[name.toLowerCase()].push(value);
			return this;
		};

		MultiMap.prototype.clear = function clear() {
			this.keys = create(null);
			this.values = create(null);
			return this;
		};

		MultiMap.prototype.contains = function contains(name) {
			return name.toLowerCase() in this.values;
		};

		MultiMap.prototype.disposeInternal = function disposeInternal() {
			this.values = null;
		};

		MultiMap.prototype.get = function get(name) {
			var values = this.values[name.toLowerCase()];
			if (values) {
				return values[0];
			}
		};

		MultiMap.prototype.getAll = function getAll(name) {
			return this.values[name.toLowerCase()];
		};

		MultiMap.prototype.isEmpty = function isEmpty() {
			return this.size() === 0;
		};

		MultiMap.prototype.names = function names() {
			var _this2 = this;

			return Object.keys(this.values).map(function (key) {
				return _this2.keys[key];
			});
		};

		MultiMap.prototype.remove = function remove(name) {
			delete this.keys[name.toLowerCase()];
			delete this.values[name.toLowerCase()];
			return this;
		};

		MultiMap.prototype.set = function set(name, value) {
			this.keys[name.toLowerCase()] = name;
			this.values[name.toLowerCase()] = [value];
			return this;
		};

		MultiMap.prototype.size = function size() {
			return this.names().length;
		};

		MultiMap.prototype.toString = function toString() {
			return JSON.stringify(this.values);
		};

		return MultiMap;
	}(_metal.Disposable);

	exports.default = MultiMap;
});
//# sourceMappingURL=MultiMap.js.map