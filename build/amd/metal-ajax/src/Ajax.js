define(['exports', 'metal/src/metal', 'metal-uri/src/Uri', 'metal-promise/src/promise/Promise'], function (exports, _metal, _Uri, _Promise) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

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

	var Ajax = function () {
		function Ajax() {
			_classCallCheck(this, Ajax);
		}

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
				url = new _Uri2.default(url).addParametersFromMultiMap(opt_params).toString();
			}

			request.open(method, url, !opt_sync);

			if (opt_headers) {
				opt_headers.names().forEach(function (name) {
					request.setRequestHeader(name, opt_headers.getAll(name).join(', '));
				});
			}

			request.send(_metal.core.isDef(body) ? body : null);

			if (_metal.core.isDefAndNotNull(opt_timeout)) {
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