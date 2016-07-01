define(['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var METAL_DATA = '__metal_data__';

	var domData = function () {
		function domData() {
			_classCallCheck(this, domData);
		}

		domData.get = function get(element) {
			if (!element[METAL_DATA]) {
				element[METAL_DATA] = {
					delegating: {},
					listeners: {}
				};
			}
			return element[METAL_DATA];
		};

		return domData;
	}();

	exports.default = domData;
});
//# sourceMappingURL=domData.js.map