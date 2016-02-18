define(['exports', '../globals/globals', 'metal-uri/src/Uri'], function (exports, _globals, _Uri) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _globals2 = _interopRequireDefault(_globals);

	var _Uri2 = _interopRequireDefault(_Uri);

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

	var utils = function () {
		function utils() {
			_classCallCheck(this, utils);
		}

		utils.getCurrentBrowserPath = function getCurrentBrowserPath() {
			return this.getCurrentBrowserPathWithoutHash() + _globals2.default.window.location.hash;
		};

		utils.getCurrentBrowserPathWithoutHash = function getCurrentBrowserPathWithoutHash() {
			return _globals2.default.window.location.pathname + _globals2.default.window.location.search;
		};

		utils.getUrlPath = function getUrlPath(url) {
			var uri = new _Uri2.default(url);
			return uri.getPathname() + uri.getSearch() + uri.getHash();
		};

		utils.getUrlPathWithoutHash = function getUrlPathWithoutHash(url) {
			var uri = new _Uri2.default(url);
			return uri.getPathname() + uri.getSearch();
		};

		utils.isCurrentBrowserPath = function isCurrentBrowserPath(url) {
			if (url) {
				return utils.getUrlPathWithoutHash(url) === this.getCurrentBrowserPathWithoutHash();
			}
			return false;
		};

		utils.isHtml5HistorySupported = function isHtml5HistorySupported() {
			return !!(_globals2.default.window.history && _globals2.default.window.history.pushState);
		};

		return utils;
	}();

	exports.default = utils;
});
//# sourceMappingURL=utils.js.map