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

	var _class = function () {
		function _class() {
			_classCallCheck(this, _class);
		}

		_class.get = function get(element) {
			if (!element[METAL_DATA]) {
				element[METAL_DATA] = {
					delegating: {},
					listeners: {}
				};
			}
			return element[METAL_DATA];
		};

		return _class;
	}();

	exports.default = _class;
});
//# sourceMappingURL=metalData.js.map