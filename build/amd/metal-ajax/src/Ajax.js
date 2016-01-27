'use strict';

define(['exports', 'metal/src/core', 'metal-promise/src/promise/Promise'], function (exports, _core, _Promise) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _core2 = _interopRequireDefault(_core);

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

	var Ajax = function () {
		function Ajax() {
			_classCallCheck(this, Ajax);
		}

		Ajax.addParametersToUrlQueryString = function addParametersToUrlQueryString(url, opt_params) {
			var querystring = '';
			opt_params.names().forEach(function (name) {
				opt_params.getAll(name).forEach(function (value) {
					querystring += name + '=' + encodeURIComponent(value) + '&';
				});
			});
			querystring = querystring.slice(0, -1);

			if (querystring) {
				url += url.indexOf('?') > -1 ? '&' : '?';
				url += querystring;
			}

			return url;
		};

		Ajax.joinPaths = function joinPaths(basePath) {
			for (var _len = arguments.length, paths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				paths[_key - 1] = arguments[_key];
			}

			if (basePath.charAt(basePath.length - 1) === '/') {
				basePath = basePath.substring(0, basePath.length - 1);
			}

			paths = paths.map(function (path) {
				return path.charAt(0) === '/' ? path.substring(1) : path;
			});
			return [basePath].concat(paths).join('/').replace(/\/$/, '');
		};

		Ajax.parseResponseHeaders = function parseResponseHeaders(allHeaders) {
			var headers = [];

			if (!allHeaders) {
				return headers;
			}

			var pairs = allHeaders.split('\r\n');

			for (var i = 0; i < pairs.length; i++) {
				var index = pairs[i].indexOf(': ');

				if (index > 0) {
					var name = pairs[i].substring(0, index);
					var value = pairs[i].substring(index + 2);
					headers.push({
						name: name,
						value: value
					});
				}
			}

			return headers;
		};

		Ajax.parseUrl = function parseUrl(url) {
			var base;
			var path;
			var qs;
			var domainAt = url.indexOf('//');

			if (domainAt > -1) {
				url = url.substring(domainAt + 2);
			}

			var pathAt = url.indexOf('/');

			if (pathAt === -1) {
				url += '/';
				pathAt = url.length - 1;
			}

			base = url.substring(0, pathAt);
			path = url.substring(pathAt);
			var qsAt = path.indexOf('?');

			if (qsAt > -1) {
				qs = path.substring(qsAt, path.length);
				path = path.substring(0, qsAt);
			} else {
				qs = '';
			}

			return [base, path, qs];
		};

		Ajax.request = function request(url, method, body, opt_headers, opt_params, opt_timeout, opt_sync) {
			var request = new XMLHttpRequest();
			var promise = new _Promise.CancellablePromise(function (resolve, reject) {
				request.onload = function () {
					if (request.aborted) {
						request.onerror();
						return;
					}

					resolve(request);
				};

				request.onerror = function () {
					var error = new Error('Request error');
					error.request = request;
					reject(error);
				};
			}).thenCatch(function (reason) {
				request.abort();
				throw reason;
			}).thenAlways(function () {
				clearTimeout(timeout);
			});

			if (opt_params) {
				url = Ajax.addParametersToUrlQueryString(url, opt_params);
			}

			request.open(method, url, !opt_sync);

			if (opt_headers) {
				opt_headers.names().forEach(function (name) {
					request.setRequestHeader(name, opt_headers.getAll(name).join(', '));
				});
			}

			request.send(_core2.default.isDef(body) ? body : null);

			if (_core2.default.isDefAndNotNull(opt_timeout)) {
				var timeout = setTimeout(function () {
					promise.cancel('Request timeout');
				}, opt_timeout);
			}

			return promise;
		};

		return Ajax;
	}();

	exports.default = Ajax;
});
//# sourceMappingURL=Ajax.js.map