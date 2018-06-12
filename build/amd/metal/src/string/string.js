define(['exports'], function (exports) {
	'use strict';

	/**
  * Set of utilities for string operations
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

	var string = function () {
		function string() {
			_classCallCheck(this, string);
		}

		_createClass(string, null, [{
			key: 'caseInsensitiveCompare',
			value: function caseInsensitiveCompare(str1, str2) {
				var test1 = String(str1).toLowerCase();
				var test2 = String(str2).toLowerCase();

				if (test1 < test2) {
					return -1;
				} else if (test1 === test2) {
					return 0;
				} else {
					return 1;
				}
			}
		}, {
			key: 'collapseBreakingSpaces',
			value: function collapseBreakingSpaces(str) {
				return str.replace(/[\t\r\n ]+/g, ' ').replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, '');
			}
		}, {
			key: 'escapeRegex',
			value: function escapeRegex(str) {
				return String(str).replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08'); // eslint-disable-line
			}
		}, {
			key: 'getRandomString',
			value: function getRandomString() {
				var x = 2147483648;
				return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ Date.now()).toString(36);
			}
		}, {
			key: 'hashCode',
			value: function hashCode(val) {
				var hash = 0;
				for (var i = 0, len = val.length; i < len; i++) {
					hash = 31 * hash + val.charCodeAt(i);
					hash %= 0x100000000;
				}
				return hash;
			}
		}, {
			key: 'replaceInterval',
			value: function replaceInterval(str, start, end, value) {
				return str.substring(0, start) + value + str.substring(end);
			}
		}]);

		return string;
	}();

	exports.default = string;
});
//# sourceMappingURL=string.js.map
