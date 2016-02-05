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

	var UA = function () {
		function UA() {
			_classCallCheck(this, UA);
		}

		UA.getNativeUserAgent = function getNativeUserAgent() {
			var navigator = UA.globals.window.navigator;

			if (navigator) {
				var userAgent = navigator.userAgent;

				if (userAgent) {
					return userAgent;
				}
			}

			return '';
		};

		UA.matchUserAgent = function matchUserAgent(str) {
			return UA.userAgent.indexOf(str) !== -1;
		};

		UA.testUserAgent = function testUserAgent(userAgent) {
			UA.userAgent = userAgent;
			UA.isOpera = UA.matchUserAgent('Opera') || UA.matchUserAgent('OPR');
			UA.isIe = UA.matchUserAgent('Trident') || UA.matchUserAgent('MSIE');
			UA.isEdge = UA.matchUserAgent('Edge');
			UA.isIeOrEdge = UA.isIe || UA.isEdge;
			UA.isChrome = (UA.matchUserAgent('Chrome') || UA.matchUserAgent('CriOS')) && !UA.isOpera && !UA.isEdge;
			UA.isSafari = UA.matchUserAgent('Safari') && !(UA.isChrome || UA.isOpera || UA.isEdge);
			UA.isFirefox = UA.matchUserAgent('Firefox');
		};

		return UA;
	}();

	UA.globals = {
		window: window
	};
	UA.testUserAgent(UA.getNativeUserAgent());
	exports.default = UA;
});
//# sourceMappingURL=UA.js.map