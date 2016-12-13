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

			var _this = _possibleConstructorReturn(this, (MultiMap.__proto__ || Object.getPrototypeOf(MultiMap)).call(this));

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


		_createClass(MultiMap, [{
			key: 'add',
			value: function add(name, value) {
				this.keys[name.toLowerCase()] = name;
				this.values[name.toLowerCase()] = this.values[name.toLowerCase()] || [];
				this.values[name.toLowerCase()].push(value);
				return this;
			}
		}, {
			key: 'clear',
			value: function clear() {
				this.keys = create(null);
				this.values = create(null);
				return this;
			}
		}, {
			key: 'contains',
			value: function contains(name) {
				return name.toLowerCase() in this.values;
			}
		}, {
			key: 'disposeInternal',
			value: function disposeInternal() {
				this.values = null;
			}
		}, {
			key: 'get',
			value: function get(name) {
				var values = this.values[name.toLowerCase()];
				if (values) {
					return values[0];
				}
			}
		}, {
			key: 'getAll',
			value: function getAll(name) {
				return this.values[name.toLowerCase()];
			}
		}, {
			key: 'isEmpty',
			value: function isEmpty() {
				return this.size() === 0;
			}
		}, {
			key: 'names',
			value: function names() {
				var _this2 = this;

				return Object.keys(this.values).map(function (key) {
					return _this2.keys[key];
				});
			}
		}, {
			key: 'remove',
			value: function remove(name) {
				delete this.keys[name.toLowerCase()];
				delete this.values[name.toLowerCase()];
				return this;
			}
		}, {
			key: 'set',
			value: function set(name, value) {
				this.keys[name.toLowerCase()] = name;
				this.values[name.toLowerCase()] = [value];
				return this;
			}
		}, {
			key: 'size',
			value: function size() {
				return this.names().length;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return JSON.stringify(this.values);
			}
		}], [{
			key: 'fromObject',
			value: function fromObject(obj) {
				var map = new MultiMap();
				var keys = Object.keys(obj);
				for (var i = 0; i < keys.length; i++) {
					map.set(keys[i], obj[keys[i]]);
				}
				return map;
			}
		}]);

		return MultiMap;
	}(_metal.Disposable);

	exports.default = MultiMap;
});
//# sourceMappingURL=MultiMap.js.map
