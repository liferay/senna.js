define(['exports', 'metal/src/metal', './parse', 'metal-multimap/src/MultiMap'], function (exports, _metal, _parse, _MultiMap) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _parse2 = _interopRequireDefault(_parse);

	var _MultiMap2 = _interopRequireDefault(_MultiMap);

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
			var opt_uri = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

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


		Uri.prototype.addParametersFromMultiMap = function addParametersFromMultiMap(multimap) {
			var _this = this;

			multimap.names().forEach(function (name) {
				multimap.getAll(name).forEach(function (value) {
					_this.addParameterValue(name, value);
				});
			});
			return this;
		};

		Uri.prototype.addParameterValue = function addParameterValue(name, value) {
			this.ensureQueryInitialized_();
			if (_metal.core.isDef(value)) {
				value = String(value);
			}
			this.query.add(name, value);
			return this;
		};

		Uri.prototype.addParameterValues = function addParameterValues(name, values) {
			var _this2 = this;

			values.forEach(function (value) {
				return _this2.addParameterValue(name, value);
			});
			return this;
		};

		Uri.prototype.ensureQueryInitialized_ = function ensureQueryInitialized_() {
			var _this3 = this;

			if (this.query) {
				return;
			}
			this.query = new _MultiMap2.default();
			var search = this.url.search;
			if (search) {
				search.substring(1).split('&').forEach(function (param) {
					var _param$split = param.split('=');

					var _param$split2 = _slicedToArray(_param$split, 2);

					var key = _param$split2[0];
					var value = _param$split2[1];

					if (_metal.core.isDef(value)) {
						value = Uri.urlDecode(value);
					}
					_this3.addParameterValue(key, value);
				});
			}
		};

		Uri.prototype.getHash = function getHash() {
			return this.url.hash || '';
		};

		Uri.prototype.getHost = function getHost() {
			var host = this.getHostname();
			if (host) {
				var port = this.getPort();
				if (port && port !== '80') {
					host += ':' + port;
				}
			}
			return host;
		};

		Uri.prototype.getHostname = function getHostname() {
			var hostname = this.url.hostname;
			if (hostname === Uri.HOSTNAME_PLACEHOLDER) {
				return '';
			}
			return hostname;
		};

		Uri.prototype.getOrigin = function getOrigin() {
			var host = this.getHost();
			if (host) {
				return this.getProtocol() + '//' + host;
			}
			return '';
		};

		Uri.prototype.getParameterValue = function getParameterValue(name) {
			this.ensureQueryInitialized_();
			return this.query.get(name);
		};

		Uri.prototype.getParameterValues = function getParameterValues(name) {
			this.ensureQueryInitialized_();
			return this.query.getAll(name);
		};

		Uri.prototype.getParameterNames = function getParameterNames() {
			this.ensureQueryInitialized_();
			return this.query.names();
		};

		Uri.getParseFn = function getParseFn() {
			return parseFn_;
		};

		Uri.prototype.getPathname = function getPathname() {
			return this.url.pathname;
		};

		Uri.prototype.getPort = function getPort() {
			return this.url.port;
		};

		Uri.prototype.getProtocol = function getProtocol() {
			return this.url.protocol;
		};

		Uri.prototype.getSearch = function getSearch() {
			var _this4 = this;

			var search = '';
			var querystring = '';
			this.getParameterNames().forEach(function (name) {
				_this4.getParameterValues(name).forEach(function (value) {
					querystring += name;
					if (_metal.core.isDef(value)) {
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
		};

		Uri.prototype.hasParameter = function hasParameter(name) {
			this.ensureQueryInitialized_();
			return this.query.contains(name);
		};

		Uri.prototype.makeUnique = function makeUnique() {
			this.setParameterValue(Uri.RANDOM_PARAM, _metal.string.getRandomString());
			return this;
		};

		Uri.prototype.maybeAddProtocolAndHostname_ = function maybeAddProtocolAndHostname_(opt_uri) {
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
		};

		Uri.normalizeObject = function normalizeObject(parsed) {
			var length = parsed.pathname ? parsed.pathname.length : 0;
			if (length > 1 && parsed.pathname[length - 1] === '/') {
				parsed.pathname = parsed.pathname.substr(0, length - 1);
			}
			return parsed;
		};

		Uri.parse = function parse(opt_uri) {
			return Uri.normalizeObject(parseFn_(opt_uri));
		};

		Uri.prototype.removeParameter = function removeParameter(name) {
			this.ensureQueryInitialized_();
			this.query.remove(name);
			return this;
		};

		Uri.prototype.removeUnique = function removeUnique() {
			this.removeParameter(Uri.RANDOM_PARAM);
			return this;
		};

		Uri.prototype.setHash = function setHash(hash) {
			this.url.hash = hash;
			return this;
		};

		Uri.prototype.setHostname = function setHostname(hostname) {
			this.url.hostname = hostname;
			return this;
		};

		Uri.prototype.setParameterValue = function setParameterValue(name, value) {
			this.removeParameter(name);
			this.addParameterValue(name, value);
			return this;
		};

		Uri.prototype.setParameterValues = function setParameterValues(name, values) {
			var _this5 = this;

			this.removeParameter(name);
			values.forEach(function (value) {
				return _this5.addParameterValue(name, value);
			});
			return this;
		};

		Uri.prototype.setPathname = function setPathname(pathname) {
			this.url.pathname = pathname;
			return this;
		};

		Uri.prototype.setPort = function setPort(port) {
			this.url.port = port;
			return this;
		};

		Uri.setParseFn = function setParseFn(parseFn) {
			parseFn_ = parseFn;
		};

		Uri.prototype.setProtocol = function setProtocol(protocol) {
			this.url.protocol = protocol;
			if (this.url.protocol[this.url.protocol.length - 1] !== ':') {
				this.url.protocol += ':';
			}
			return this;
		};

		Uri.prototype.toString = function toString() {
			var href = '';
			var host = this.getHost();
			if (host) {
				href += this.getProtocol() + '//';
			}
			href += host + this.getPathname() + this.getSearch() + this.getHash();
			return href;
		};

		Uri.joinPaths = function joinPaths(basePath) {
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

		Uri.urlDecode = function urlDecode(str) {
			return decodeURIComponent(str.replace(/\+/g, ' '));
		};

		return Uri;
	}();

	/**
  * Default protocol value.
  * @type {string}
  * @default http:
  * @static
  */
	Uri.DEFAULT_PROTOCOL = 'http:';

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