define(['exports'], function (exports) {
	'use strict';

	/**
  * Set of utilities for object operations
  */

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

	var object = function () {
		function object() {
			_classCallCheck(this, object);
		}

		_createClass(object, null, [{
			key: 'mixin',
			value: function mixin(target) {
				var key = void 0;
				var source = void 0;

				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				for (var i = 0; i < args.length; i++) {
					source = args[i];
					// Possible prototype chain leak, breaks 1 metal-dom and
					// 1 metal-incremental-dom test if guard-for-in rule is addressed
					// eslint-disable-next-line
					for (key in source) {
						target[key] = source[key];
					}
				}
				return target;
			}
		}, {
			key: 'getObjectByName',
			value: function getObjectByName(name) {
				var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

				var parts = name.split('.');
				return parts.reduce(function (part, key) {
					return part[key];
				}, scope);
			}
		}, {
			key: 'map',
			value: function map(obj, fn) {
				var mappedObj = {};
				var keys = Object.keys(obj);
				for (var i = 0; i < keys.length; i++) {
					mappedObj[keys[i]] = fn(keys[i], obj[keys[i]]);
				}
				return mappedObj;
			}
		}, {
			key: 'shallowEqual',
			value: function shallowEqual(obj1, obj2) {
				if (obj1 === obj2) {
					return true;
				}

				var keys1 = Object.keys(obj1);
				var keys2 = Object.keys(obj2);
				if (keys1.length !== keys2.length) {
					return false;
				}

				for (var i = 0; i < keys1.length; i++) {
					if (obj1[keys1[i]] !== obj2[keys1[i]]) {
						return false;
					}
				}
				return true;
			}
		}]);

		return object;
	}();

	exports.default = object;
});
//# sourceMappingURL=object.js.map
