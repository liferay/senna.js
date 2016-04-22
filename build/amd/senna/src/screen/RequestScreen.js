define(['exports', 'metal/src/metal', 'metal-ajax/src/Ajax', 'metal-multimap/src/MultiMap', 'metal-promise/src/promise/Promise', '../errors/errors', '../utils/utils', '../globals/globals', './Screen', 'metal-uri/src/Uri', 'metal-useragent/src/UA'], function (exports, _metal, _Ajax, _MultiMap, _Promise, _errors, _utils, _globals, _Screen2, _Uri, _UA) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Ajax2 = _interopRequireDefault(_Ajax);

	var _MultiMap2 = _interopRequireDefault(_MultiMap);

	var _Promise2 = _interopRequireDefault(_Promise);

	var _errors2 = _interopRequireDefault(_errors);

	var _utils2 = _interopRequireDefault(_utils);

	var _globals2 = _interopRequireDefault(_globals);

	var _Screen3 = _interopRequireDefault(_Screen2);

	var _Uri2 = _interopRequireDefault(_Uri);

	var _UA2 = _interopRequireDefault(_UA);

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

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var RequestScreen = function (_Screen) {
		_inherits(RequestScreen, _Screen);

		/**
   * Request screen abstract class to perform io operations on descendant
   * screens.
   * @constructor
   * @extends {Screen}
   */

		function RequestScreen() {
			_classCallCheck(this, RequestScreen);

			var _this = _possibleConstructorReturn(this, _Screen.call(this));

			/**
    * @inheritDoc
    * @default true
    */
			_this.cacheable = true;

			/**
    * Holds default http headers to set on request.
    * @type {?Object=}
    * @default {
    *   'X-PJAX': 'true',
    *   'X-Requested-With': 'XMLHttpRequest'
    * }
    * @protected
    */
			_this.httpHeaders = {
				'X-PJAX': 'true',
				'X-Requested-With': 'XMLHttpRequest'
			};

			/**
    * Holds default http method to perform the request.
    * @type {!string}
    * @default RequestScreen.GET
    * @protected
    */
			_this.httpMethod = RequestScreen.GET;

			/**
    * Holds the XHR object responsible for the request.
    * @type {XMLHttpRequest}
    * @default null
    * @protected
    */
			_this.request = null;

			/**
    * Holds the request timeout in milliseconds.
    * @type {!number}
    * @default 30000
    * @protected
    */
			_this.timeout = 30000;
			return _this;
		}

		/**
   * Asserts that response status code is valid.
   * @param {number} status
   * @protected
   */


		RequestScreen.prototype.assertValidResponseStatusCode = function assertValidResponseStatusCode(status) {
			if (!this.isValidResponseStatusCode(status)) {
				var error = new Error(_errors2.default.INVALID_STATUS);
				error.invalidStatus = true;
				throw error;
			}
		};

		RequestScreen.prototype.beforeUpdateHistoryPath = function beforeUpdateHistoryPath(path) {
			var redirectPath = this.getRequestPath();
			if (redirectPath && redirectPath !== path) {
				return redirectPath;
			}
			return path;
		};

		RequestScreen.prototype.beforeUpdateHistoryState = function beforeUpdateHistoryState(state) {
			// If state is ours and navigate to post-without-redirect-get set
			// history state to null, that way Senna will reload the page on
			// popstate since it cannot predict post data.
			if (state.senna && state.form && state.redirectPath === state.path) {
				return null;
			}
			return state;
		};

		RequestScreen.prototype.formatLoadPath = function formatLoadPath(path) {
			if (_UA2.default.isIeOrEdge && this.httpMethod === RequestScreen.GET) {
				return new _Uri2.default(path).makeUnique().toString();
			}
			return path;
		};

		RequestScreen.prototype.getHttpHeaders = function getHttpHeaders() {
			return this.httpHeaders;
		};

		RequestScreen.prototype.getHttpMethod = function getHttpMethod() {
			return this.httpMethod;
		};

		RequestScreen.prototype.getRequestPath = function getRequestPath() {
			var request = this.getRequest();
			if (request) {
				var requestPath = request.requestPath;
				var responseUrl = this.maybeExtractResponseUrlFromRequest(request);
				if (responseUrl) {
					requestPath = responseUrl;
				}
				if (_UA2.default.isIeOrEdge && this.httpMethod === RequestScreen.GET) {
					requestPath = new _Uri2.default(requestPath).removeUnique().toString();
				}
				return _utils2.default.getUrlPath(requestPath);
			}
			return null;
		};

		RequestScreen.prototype.getRequest = function getRequest() {
			return this.request;
		};

		RequestScreen.prototype.getTimeout = function getTimeout() {
			return this.timeout;
		};

		RequestScreen.prototype.isValidResponseStatusCode = function isValidResponseStatusCode(statusCode) {
			return statusCode >= 200 && statusCode <= 399;
		};

		RequestScreen.prototype.load = function load(path) {
			var _this2 = this;

			var cache = this.getCache();
			if (_metal.core.isDefAndNotNull(cache)) {
				return _Promise2.default.resolve(cache);
			}

			var body = null;
			var httpMethod = this.httpMethod;

			var headers = new _MultiMap2.default();
			Object.keys(this.httpHeaders).forEach(function (header) {
				return headers.add(header, _this2.httpHeaders[header]);
			});

			if (_globals2.default.capturedFormElement) {
				body = new FormData(_globals2.default.capturedFormElement);
				httpMethod = RequestScreen.POST;
				if (_UA2.default.isIeOrEdge) {
					headers.add('If-None-Match', '"0"');
				}
			}

			var requestPath = this.formatLoadPath(path);
			return _Ajax2.default.request(requestPath, httpMethod, body, headers, null, this.timeout).then(function (xhr) {
				_this2.setRequest(xhr);
				_this2.assertValidResponseStatusCode(xhr.status);
				if (httpMethod === RequestScreen.GET && _this2.isCacheable()) {
					_this2.addCache(xhr.responseText);
				}
				xhr.requestPath = requestPath;
				return xhr.responseText;
			}).catch(function (reason) {
				switch (reason.message) {
					case _errors2.default.REQUEST_TIMEOUT:
						reason.timeout = true;
						break;
					case _errors2.default.REQUEST_ERROR:
						reason.requestError = true;
						break;
				}
				throw reason;
			});
		};

		RequestScreen.prototype.maybeExtractResponseUrlFromRequest = function maybeExtractResponseUrlFromRequest(request) {
			var responseUrl = request.responseURL;
			if (responseUrl) {
				return responseUrl;
			}
			return request.getResponseHeader(RequestScreen.X_REQUEST_URL_HEADER);
		};

		RequestScreen.prototype.setHttpHeaders = function setHttpHeaders(httpHeaders) {
			this.httpHeaders = httpHeaders;
		};

		RequestScreen.prototype.setHttpMethod = function setHttpMethod(httpMethod) {
			this.httpMethod = httpMethod.toLowerCase();
		};

		RequestScreen.prototype.setRequest = function setRequest(request) {
			this.request = request;
		};

		RequestScreen.prototype.setTimeout = function setTimeout(timeout) {
			this.timeout = timeout;
		};

		return RequestScreen;
	}(_Screen3.default);

	/**
  * Holds value for method get.
  * @type {string}
  * @default 'get'
  * @static
  */
	RequestScreen.GET = 'get';

	/**
  * Holds value for method post.
  * @type {string}
  * @default 'post'
  * @static
  */
	RequestScreen.POST = 'post';

	/**
  * Fallback http header to retrieve response request url.
  * @type {string}
  * @default 'X-Request-URL'
  * @static
  */
	RequestScreen.X_REQUEST_URL_HEADER = 'X-Request-URL';

	exports.default = RequestScreen;
});
//# sourceMappingURL=RequestScreen.js.map