define(['exports', 'metal-dom/src/all/dom', '../globals/globals', 'metal-uri/src/Uri'], function (exports, _dom, _globals, _Uri) {
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

	var utils = function () {
		function utils() {
			_classCallCheck(this, utils);
		}

		_createClass(utils, null, [{
			key: 'copyNodeAttributes',
			value: function copyNodeAttributes(source, target) {
				Array.prototype.slice.call(source.attributes).forEach(function (attribute) {
					return target.setAttribute(attribute.name, attribute.value);
				});
			}
		}, {
			key: 'getCurrentBrowserPath',
			value: function getCurrentBrowserPath() {
				return this.getCurrentBrowserPathWithoutHash() + _globals2.default.window.location.hash;
			}
		}, {
			key: 'getCurrentBrowserPathWithoutHash',
			value: function getCurrentBrowserPathWithoutHash() {
				return _globals2.default.window.location.pathname + _globals2.default.window.location.search;
			}
		}, {
			key: 'getNodeOffset',
			value: function getNodeOffset(node) {
				var offsetLeft = 0,
				    offsetTop = 0;

				do {
					offsetLeft += node.offsetLeft;
					offsetTop += node.offsetTop;
					node = node.offsetParent;
				} while (node);
				return {
					offsetLeft: offsetLeft,
					offsetTop: offsetTop
				};
			}
		}, {
			key: 'getUrlPath',
			value: function getUrlPath(url) {
				var uri = new _Uri2.default(url);
				return uri.getPathname() + uri.getSearch() + uri.getHash();
			}
		}, {
			key: 'getUrlPathWithoutHash',
			value: function getUrlPathWithoutHash(url) {
				var uri = new _Uri2.default(url);
				return uri.getPathname() + uri.getSearch();
			}
		}, {
			key: 'getUrlPathWithoutHashAndSearch',
			value: function getUrlPathWithoutHashAndSearch(url) {
				var uri = new _Uri2.default(url);
				return uri.getPathname();
			}
		}, {
			key: 'isCurrentBrowserPath',
			value: function isCurrentBrowserPath(url) {
				if (url) {
					var currentBrowserPath = this.getCurrentBrowserPathWithoutHash();
					// the getUrlPath will create a Uri and will normalize the path and
					// remove the trailling '/' for properly comparing paths.
					return utils.getUrlPathWithoutHash(url) === this.getUrlPath(currentBrowserPath);
				}
				return false;
			}
		}, {
			key: 'isHtml5HistorySupported',
			value: function isHtml5HistorySupported() {
				return !!(_globals2.default.window.history && _globals2.default.window.history.pushState);
			}
		}, {
			key: 'isWebUri',
			value: function isWebUri(url) {
				try {
					return new _Uri2.default(url);
				} catch (err) {
					void 0;
					return false;
				}
			}
		}, {
			key: 'clearNodeAttributes',
			value: function clearNodeAttributes(node) {
				Array.prototype.slice.call(node.attributes).forEach(function (attribute) {
					return node.removeAttribute(attribute.name);
				});
			}
		}, {
			key: 'removeElementsFromDocument',
			value: function removeElementsFromDocument(elements) {
				elements.forEach(function (element) {
					return (0, _dom.exitDocument)(element);
				});
			}
		}, {
			key: 'removePathTrailingSlash',
			value: function removePathTrailingSlash(path) {
				var length = path ? path.length : 0;
				if (length > 1 && path[length - 1] === '/') {
					path = path.substr(0, length - 1);
				}
				return path;
			}
		}, {
			key: 'setElementWithRandomHref',
			value: function setElementWithRandomHref(element) {
				element.href = element.href + '?q=' + Math.random();
				return element;
			}
		}, {
			key: 'setReferrer',
			value: function setReferrer(referrer) {
				Object.defineProperty(_globals2.default.document, 'referrer', {
					configurable: true,
					get: function get() {
						return referrer;
					}
				});
			}
		}]);

		return utils;
	}();

	exports.default = utils;
});
//# sourceMappingURL=utils.js.map
