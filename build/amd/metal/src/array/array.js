define(['exports', '../core'], function (exports, _core) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _core2 = _interopRequireDefault(_core);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var array = function () {
		function array() {
			_classCallCheck(this, array);
		}

		array.equal = function equal(arr1, arr2) {
			if (arr1.length !== arr2.length) {
				return false;
			}
			for (var i = 0; i < arr1.length; i++) {
				if (arr1[i] !== arr2[i]) {
					return false;
				}
			}
			return true;
		};

		array.firstDefinedValue = function firstDefinedValue(arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] !== undefined) {
					return arr[i];
				}
			}
		};

		array.flatten = function flatten(arr, opt_output) {
			var output = opt_output || [];
			for (var i = 0; i < arr.length; i++) {
				if (Array.isArray(arr[i])) {
					array.flatten(arr[i], output);
				} else {
					output.push(arr[i]);
				}
			}
			return output;
		};

		array.remove = function remove(arr, obj) {
			var i = arr.indexOf(obj);
			var rv;
			if (rv = i >= 0) {
				array.removeAt(arr, i);
			}
			return rv;
		};

		array.removeAt = function removeAt(arr, i) {
			return Array.prototype.splice.call(arr, i, 1).length === 1;
		};

		array.slice = function slice(arr, start, opt_end) {
			var sliced = [];
			var end = _core2.default.isDef(opt_end) ? opt_end : arr.length;
			for (var i = start; i < end; i++) {
				sliced.push(arr[i]);
			}
			return sliced;
		};

		return array;
	}();

	exports.default = array;
});
//# sourceMappingURL=array.js.map