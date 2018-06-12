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

	var UA = function () {
		function UA() {
			_classCallCheck(this, UA);
		}

		_createClass(UA, null, [{
			key: 'getNativeUserAgent',
			value: function getNativeUserAgent() {
				var navigator = UA.globals.window && UA.globals.window.navigator;
				if (navigator) {
					var userAgent = navigator.userAgent;
					if (userAgent) {
						return userAgent;
					}
				}
				return '';
			}
		}, {
			key: 'getNativePlatform',
			value: function getNativePlatform() {
				var navigator = UA.globals.window && UA.globals.window.navigator;
				if (navigator) {
					var platform = navigator.platform;
					if (platform) {
						return platform;
					}
				}
				return '';
			}
		}, {
			key: 'matchPlatform',
			value: function matchPlatform(str) {
				return UA.platform.indexOf(str) !== -1;
			}
		}, {
			key: 'matchUserAgent',
			value: function matchUserAgent(str) {
				return UA.userAgent.indexOf(str) !== -1;
			}
		}, {
			key: 'testUserAgent',
			value: function testUserAgent() {
				var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
				var platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

				/**
     * Holds the user agent value extracted from browser native user agent.
     * @type {string}
     * @static
     */
				UA.userAgent = userAgent;

				/**
     * Holds the platform value extracted from browser native platform.
     * @type {string}
     * @static
     */
				UA.platform = platform;

				/**
     * Whether the user's OS is Mac.
     * @type {boolean}
     * @static
     */
				UA.isMac = UA.matchPlatform('Mac');

				/**
     * Whether the user's OS is Win.
     * @type {boolean}
     * @static
     */
				UA.isWin = UA.matchPlatform('Win');

				/**
     * Whether the user's browser is Opera.
     * @type {boolean}
     * @static
     */
				UA.isOpera = UA.matchUserAgent('Opera') || UA.matchUserAgent('OPR');

				/**
     * Whether the user's browser is IE.
     * @type {boolean}
     * @static
     */
				UA.isIe = UA.matchUserAgent('Trident') || UA.matchUserAgent('MSIE');

				/**
     * Whether the user's browser is Edge.
     * @type {boolean}
     * @static
     */
				UA.isEdge = UA.matchUserAgent('Edge');

				/**
     * Whether the user's browser is IE or Edge.
     * @type {boolean}
     * @static
     */
				UA.isIeOrEdge = UA.isIe || UA.isEdge;

				/**
     * Whether the user's browser is Chrome.
     * @type {boolean}
     * @static
     */
				UA.isChrome = (UA.matchUserAgent('Chrome') || UA.matchUserAgent('CriOS')) && !UA.isOpera && !UA.isEdge;

				/**
     * Whether the user's browser is Safari.
     * @type {boolean}
     * @static
     */
				UA.isSafari = UA.matchUserAgent('Safari') && !(UA.isChrome || UA.isOpera || UA.isEdge);

				/**
     * Whether the user's browser is Firefox.
     * @type {boolean}
     * @static
     */
				UA.isFirefox = UA.matchUserAgent('Firefox');
			}
		}]);

		return UA;
	}();

	/**
  * Exposes global references.
  * @type {object}
  * @static
  */
	Object.defineProperty(UA, 'globals', {
		writable: true,
		value: {
			window: (0, _metal.isServerSide)() ? null : window
		}
	});

	UA.testUserAgent(UA.getNativeUserAgent(), UA.getNativePlatform());

	exports.default = UA;
});
//# sourceMappingURL=UA.js.map
