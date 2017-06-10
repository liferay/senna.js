define(['exports', 'metal/src/metal', './parse', 'metal-structs/src/all/structs'], function (exports, _metal, _parse, _structs) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _parse2 = _interopRequireDefault(_parse);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var _slicedToArray = function () {
		function sliceIterator(arr, i) {
			var _arr = [];
			var _n = true;
			var _d = false;
			var _e = undefined;

			try {
				for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
					_arr.push(_s.value);

					if (i && _arr.length === i) break;
				}
			} catch (err) {
				_d = true;
				_e = err;
			} finally {
				try {
					if (!_n && _i["return"]) _i["return"]();
				} finally {
					if (_d) throw _e;
				}
			}

			return _arr;
		}

		return function (arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				return sliceIterator(arr, i);
			} else {
				throw new TypeError("Invalid attempt to destructure non-iterable instance");
			}
		};
	}();

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

	var parseFn_ = _parse2.default;

	var Uri = function () {

		/**
   * This class contains setters and getters for the parts of the URI.
   * The following figure displays an example URIs and their component parts.
   *
   *                                  path
   *	                             ┌───┴────┐
   *	  abc://example.com:123/path/data?key=value#fragid1
   *	  └┬┘   └────┬────┘ └┬┘           └───┬───┘ └──┬──┘
   * protocol  hostname  port            search    hash
   *          └──────┬───────┘
   *                host
   *
   * @param {*=} opt_uri Optional string URI to parse
   * @constructor
   */
		function Uri() {
			var opt_uri = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			_classCallCheck(this, Uri);

			this.url = Uri.parse(this.maybeAddProtocolAndHostname_(opt_uri));
		}

		/**
   * Adds parameters to uri from a <code>MultiMap</code> as source.
   * @param {MultiMap} multimap The <code>MultiMap</code> containing the
   *   parameters.
   * @protected
   * @chainable
   */


		_createClass(Uri, [{
			key: 'addParametersFromMultiMap',
			value: function addParametersFromMultiMap(multimap) {
				var _this = this;

				multimap.names().forEach(function (name) {
					multimap.getAll(name).forEach(function (value) {
						_this.addParameterValue(name, value);
					});
				});
				return this;
			}
		}, {
			key: 'addParameterValue',
			value: function addParameterValue(name, value) {
				this.ensureQueryInitialized_();
				if ((0, _metal.isDef)(value)) {
					value = String(value);
				}
				this.query.add(name, value);
				return this;
			}
		}, {
			key: 'addParameterValues',
			value: function addParameterValues(name, values) {
				var _this2 = this;

				values.forEach(function (value) {
					return _this2.addParameterValue(name, value);
				});
				return this;
			}
		}, {
			key: 'ensureQueryInitialized_',
			value: function ensureQueryInitialized_() {
				var _this3 = this;

				if (this.query) {
					return;
				}
				this.query = new _structs.MultiMap();
				var search = this.url.search;
				if (search) {
					search.substring(1).split('&').forEach(function (param) {
						var _param$split = param.split('='),
						    _param$split2 = _slicedToArray(_param$split, 2),
						    key = _param$split2[0],
						    value = _param$split2[1];

						if ((0, _metal.isDef)(value)) {
							value = Uri.urlDecode(value);
						}
						_this3.addParameterValue(key, value);
					});
				}
			}
		}, {
			key: 'getHash',
			value: function getHash() {
				return this.url.hash || '';
			}
		}, {
			key: 'getHost',
			value: function getHost() {
				var host = this.getHostname();
				if (host) {
					var port = this.getPort();
					if (port && port !== '80') {
						host += ':' + port;
					}
				}
				return host;
			}
		}, {
			key: 'getHostname',
			value: function getHostname() {
				var hostname = this.url.hostname;
				if (hostname === Uri.HOSTNAME_PLACEHOLDER) {
					return '';
				}
				return hostname;
			}
		}, {
			key: 'getOrigin',
			value: function getOrigin() {
				var host = this.getHost();
				if (host) {
					return this.getProtocol() + '//' + host;
				}
				return '';
			}
		}, {
			key: 'getParameterValue',
			value: function getParameterValue(name) {
				this.ensureQueryInitialized_();
				return this.query.get(name);
			}
		}, {
			key: 'getParameterValues',
			value: function getParameterValues(name) {
				this.ensureQueryInitialized_();
				return this.query.getAll(name);
			}
		}, {
			key: 'getParameterNames',
			value: function getParameterNames() {
				this.ensureQueryInitialized_();
				return this.query.names();
			}
		}, {
			key: 'getPathname',
			value: function getPathname() {
				return this.url.pathname;
			}
		}, {
			key: 'getPort',
			value: function getPort() {
				return this.url.port;
			}
		}, {
			key: 'getProtocol',
			value: function getProtocol() {
				return this.url.protocol;
			}
		}, {
			key: 'getSearch',
			value: function getSearch() {
				var _this4 = this;

				var search = '';
				var querystring = '';
				this.getParameterNames().forEach(function (name) {
					_this4.getParameterValues(name).forEach(function (value) {
						querystring += name;
						if ((0, _metal.isDef)(value)) {
							querystring += '=' + encodeURIComponent(value);
						}
						querystring += '&';
					});
				});
				querystring = querystring.slice(0, -1);
				if (querystring) {
					search += '?' + querystring;
				}
				return search;
			}
		}, {
			key: 'hasParameter',
			value: function hasParameter(name) {
				this.ensureQueryInitialized_();
				return this.query.contains(name);
			}
		}, {
			key: 'makeUnique',
			value: function makeUnique() {
				this.setParameterValue(Uri.RANDOM_PARAM, _metal.string.getRandomString());
				return this;
			}
		}, {
			key: 'maybeAddProtocolAndHostname_',
			value: function maybeAddProtocolAndHostname_(opt_uri) {
				var url = opt_uri;
				if (opt_uri.indexOf('://') === -1 && opt_uri.indexOf('javascript:') !== 0) {
					// jshint ignore:line

					url = Uri.DEFAULT_PROTOCOL;
					if (opt_uri[0] !== '/' || opt_uri[1] !== '/') {
						url += '//';
					}

					switch (opt_uri.charAt(0)) {
						case '.':
						case '?':
						case '#':
							url += Uri.HOSTNAME_PLACEHOLDER;
							url += '/';
							url += opt_uri;
							break;
						case '':
						case '/':
							if (opt_uri[1] !== '/') {
								url += Uri.HOSTNAME_PLACEHOLDER;
							}
							url += opt_uri;
							break;
						default:
							url += opt_uri;
					}
				}
				return url;
			}
		}, {
			key: 'removeParameter',
			value: function removeParameter(name) {
				this.ensureQueryInitialized_();
				this.query.remove(name);
				return this;
			}
		}, {
			key: 'removeUnique',
			value: function removeUnique() {
				this.removeParameter(Uri.RANDOM_PARAM);
				return this;
			}
		}, {
			key: 'setHash',
			value: function setHash(hash) {
				this.url.hash = hash;
				return this;
			}
		}, {
			key: 'setHostname',
			value: function setHostname(hostname) {
				this.url.hostname = hostname;
				return this;
			}
		}, {
			key: 'setParameterValue',
			value: function setParameterValue(name, value) {
				this.removeParameter(name);
				this.addParameterValue(name, value);
				return this;
			}
		}, {
			key: 'setParameterValues',
			value: function setParameterValues(name, values) {
				var _this5 = this;

				this.removeParameter(name);
				values.forEach(function (value) {
					return _this5.addParameterValue(name, value);
				});
				return this;
			}
		}, {
			key: 'setPathname',
			value: function setPathname(pathname) {
				this.url.pathname = pathname;
				return this;
			}
		}, {
			key: 'setPort',
			value: function setPort(port) {
				this.url.port = port;
				return this;
			}
		}, {
			key: 'setProtocol',
			value: function setProtocol(protocol) {
				this.url.protocol = protocol;
				if (this.url.protocol[this.url.protocol.length - 1] !== ':') {
					this.url.protocol += ':';
				}
				return this;
			}
		}, {
			key: 'toString',
			value: function toString() {
				var href = '';
				var host = this.getHost();
				if (host) {
					href += this.getProtocol() + '//';
				}
				href += host + this.getPathname() + this.getSearch() + this.getHash();
				return href;
			}
		}], [{
			key: 'getParseFn',
			value: function getParseFn() {
				return parseFn_;
			}
		}, {
			key: 'parse',
			value: function parse(opt_uri) {
				return parseFn_(opt_uri);
			}
		}, {
			key: 'setParseFn',
			value: function setParseFn(parseFn) {
				parseFn_ = parseFn;
			}
		}, {
			key: 'joinPaths',
			value: function joinPaths(basePath) {
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
			}
		}, {
			key: 'urlDecode',
			value: function urlDecode(str) {
				return decodeURIComponent(str.replace(/\+/g, ' '));
			}
		}]);

		return Uri;
	}();

	/**
  * Default protocol value.
  * @type {string}
  * @default http:
  * @static
  */
	var isSecure = function isSecure() {
		return typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.indexOf('https') === 0;
	};

	Uri.DEFAULT_PROTOCOL = isSecure() ? 'https:' : 'http:';

	/**
  * Hostname placeholder. Relevant to internal usage only.
  * @type {string}
  * @static
  */
	Uri.HOSTNAME_PLACEHOLDER = 'hostname' + Date.now();

	/**
  * Name used by the param generated by `makeUnique`.
  * @type {string}
  * @static
  */
	Uri.RANDOM_PARAM = 'zx';

	exports.default = Uri;
});
//# sourceMappingURL=Uri.js.map
