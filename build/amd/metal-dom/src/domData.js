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

	var METAL_DATA = '__metal_data__';

	/**
  * Set of utilities for dom data operations
  */

	var domData = function () {
		function domData() {
			_classCallCheck(this, domData);
		}

		_createClass(domData, null, [{
			key: 'get',
			value: function get(element, name, initialValue) {
				if (!element[METAL_DATA]) {
					element[METAL_DATA] = {};
				}
				if (!name) {
					return element[METAL_DATA];
				}
				if (!(0, _metal.isDef)(element[METAL_DATA][name]) && (0, _metal.isDef)(initialValue)) {
					element[METAL_DATA][name] = initialValue;
				}
				return element[METAL_DATA][name];
			}
		}, {
			key: 'has',
			value: function has(element) {
				return !!element[METAL_DATA];
			}
		}, {
			key: 'set',
			value: function set(element, name, value) {
				if (!element[METAL_DATA]) {
					element[METAL_DATA] = {};
				}
				if (!name || !(0, _metal.isDef)(value)) {
					return element[METAL_DATA];
				}
				element[METAL_DATA][name] = value;
				return element[METAL_DATA][name];
			}
		}]);

		return domData;
	}();

	exports.default = domData;
});
//# sourceMappingURL=domData.js.map
