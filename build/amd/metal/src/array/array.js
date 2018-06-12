define(['exports'], function (exports) {
	'use strict';

	/**
  * Set of utilities for array operations
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

	var array = function () {
		function array() {
			_classCallCheck(this, array);
		}

		_createClass(array, null, [{
			key: 'equal',
			value: function equal(arr1, arr2) {
				if (arr1 === arr2) {
					return true;
				}
				if (arr1.length !== arr2.length) {
					return false;
				}
				for (var i = 0; i < arr1.length; i++) {
					if (arr1[i] !== arr2[i]) {
						return false;
					}
				}
				return true;
			}
		}, {
			key: 'firstDefinedValue',
			value: function firstDefinedValue(arr) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] !== undefined) {
						return arr[i];
					}
				}
			}
		}, {
			key: 'flatten',
			value: function flatten(arr) {
				var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

				for (var i = 0; i < arr.length; i++) {
					if (Array.isArray(arr[i])) {
						array.flatten(arr[i], output);
					} else {
						output.push(arr[i]);
					}
				}
				return output;
			}
		}, {
			key: 'remove',
			value: function remove(arr, obj) {
				var i = arr.indexOf(obj);
				var rv = void 0;
				if (rv = i >= 0) {
					array.removeAt(arr, i);
				}
				return rv;
			}
		}, {
			key: 'removeAt',
			value: function removeAt(arr, i) {
				return Array.prototype.splice.call(arr, i, 1).length === 1;
			}
		}, {
			key: 'slice',
			value: function slice(arr, start) {
				var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : arr.length;

				var sliced = [];
				for (var i = start; i < end; i++) {
					sliced.push(arr[i]);
				}
				return sliced;
			}
		}]);

		return array;
	}();

	exports.default = array;
});
//# sourceMappingURL=array.js.map
