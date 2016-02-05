var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(['exports', 'metal/src/index', 'metal-ajax/src/Ajax', 'metal-multimap/src/MultiMap', 'metal-promise/src/promise/Promise', '../globals/globals', './Screen', 'metal-uri/src/Uri', 'metal-useragent/src/UA'], function (exports, _index, _Ajax, _MultiMap, _Promise, _globals, _Screen2, _Uri, _UA) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Ajax2 = _interopRequireDefault(_Ajax);

	var _MultiMap2 = _interopRequireDefault(_MultiMap);

	var _Promise2 = _interopRequireDefault(_Promise);

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

		return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
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

		function RequestScreen() {
			_classCallCheck(this, RequestScreen);

			var _this = _possibleConstructorReturn(this, _Screen.call(this));

			_this.cacheable = true;
			_this.httpHeaders = {
				'X-PJAX': 'true',
				'X-Requested-With': 'XMLHttpRequest'
			};
			_this.httpMethod = RequestScreen.GET;
			_this.request = null;
			_this.timeout = 30000;
			return _this;
		}

		RequestScreen.prototype.assertValidResponseStatusCode = function assertValidResponseStatusCode(status) {
			if (!this.isValidResponseStatusCode(status)) {
				var error = new Error('Invalid response status code. ' + 'To customize which status codes are valid, ' + 'overwrite `screen.isValidResponseStatusCode` method.');
				error.responseError = true;
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
			if (state.senna && state.form && state.redirectPath === state.path) {
				return null;
			}

			return state;
		};

		RequestScreen.prototype.formatLoadPath = function formatLoadPath(path) {
			if (_UA2.default.isIeOrEdge && this.httpMethod === RequestScreen.GET) {
				var uri = new _Uri2.default(path);
				uri.makeUnique();
				return uri.toString();
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
				var uri = new _Uri2.default(request.responseURL);
				return uri.getPathname() + uri.getSearch() + uri.getHash();
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

			if (_index.core.isDefAndNotNull(cache)) {
				return _Promise2.default.resolve(cache);
			}

			var body = null;
			var httpMethod = this.httpMethod;

			if (_globals2.default.capturedFormElement) {
				body = new FormData(_globals2.default.capturedFormElement);
				httpMethod = RequestScreen.POST;
			}

			var headers = new _MultiMap2.default();
			Object.keys(this.httpHeaders).forEach(function (header) {
				return headers.add(header, _this2.httpHeaders[header]);
			});
			return _Ajax2.default.request(this.formatLoadPath(path), httpMethod, body, headers, null, this.timeout).then(function (xhr) {
				_this2.setRequest(xhr);

				_this2.assertValidResponseStatusCode(xhr.status);

				if (httpMethod === RequestScreen.GET && _this2.isCacheable()) {
					_this2.addCache(xhr.responseText);
				}

				return xhr.responseText;
			});
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

	RequestScreen.prototype.registerMetalComponent && RequestScreen.prototype.registerMetalComponent(RequestScreen, 'RequestScreen')
	RequestScreen.GET = 'get';
	RequestScreen.POST = 'post';
	exports.default = RequestScreen;
});
//# sourceMappingURL=RequestScreen.js.map