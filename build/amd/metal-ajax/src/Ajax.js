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

	var Ajax = function () {
		function Ajax() {
			_classCallCheck(this, Ajax);
		}

		_createClass(Ajax, null, [{
			key: 'parseResponseHeaders',
			value: function parseResponseHeaders(allHeaders) {
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
			}
		}, {
			key: 'request',
			value: function request(url, method, body, opt_headers, opt_params, opt_timeout, opt_sync, opt_withCredentials) {
				url = url || '';
				method = method || 'GET';

				var request = new XMLHttpRequest();
				var previousReadyState = 0;

				var promise = new _Promise.CancellablePromise(function (resolve, reject) {
					request.onload = function () {
						if (request.aborted) {
							request.onerror();
							return;
						}
						resolve(request);
					};
					request.onreadystatechange = function () {
						if (previousReadyState && previousReadyState < 3 && 4 === request.readyState) {
							request.terminatedPrematurely = true;
						}
						previousReadyState = request.readyState;
					};
					request.onerror = function () {
						var message = 'Request error';
						if (request.terminatedPrematurely) {
							message = 'Request terminated prematurely';
						}
						var error = new Error(message);
						error.request = request;
						reject(error);
					};
				}).thenCatch(function (reason) {
					request.abort();
					throw reason;
				}).thenAlways(function () {
					clearTimeout(timeout);
				});

				url = new _Uri2.default(url);

				if (opt_params) {
					url.addParametersFromMultiMap(opt_params).toString();
				}

				url = url.toString();

				request.open(method, url, !opt_sync);

				if (opt_withCredentials) {
					request.withCredentials = true;
				}

				if (opt_headers) {
					opt_headers.names().forEach(function (name) {
						request.setRequestHeader(name, opt_headers.getAll(name).join(', '));
					});
				}

				request.send((0, _metal.isDef)(body) ? body : null);

				if ((0, _metal.isDefAndNotNull)(opt_timeout)) {
					var timeout = setTimeout(function () {
						promise.cancel('Request timeout');
					}, opt_timeout);
				}

				return promise;
			}
		}]);

		return Ajax;
	}();

	exports.default = Ajax;
});
//# sourceMappingURL=Ajax.js.map
