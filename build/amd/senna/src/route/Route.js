define(['exports', 'metal/src/metal', 'metal-path-parser/src/pathParser'], function (exports, _metal, _pathParser) {
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

	var Route = function () {

		/**
   * Route class.
   * @param {!string|RegExp|Function} path
   * @param {!Function} handler
   * @constructor
   */
		function Route(path, handler) {
			_classCallCheck(this, Route);

			if (!(0, _metal.isDefAndNotNull)(path)) {
				throw new Error('Route path not specified.');
			}
			if (!(0, _metal.isFunction)(handler)) {
				throw new Error('Route handler is not a function.');
			}

			/**
    * Defines the handler which will execute once a URL in the application
    * matches the path.
    * @type {!Function}
    * @protected
    */
			this.handler = handler;

			/**
    * Defines the path which will trigger the route handler.
    * @type {!string|RegExp|Function}
    * @protected
    */
			this.path = path;
		}

		/**
  * Builds parsed data (regex and tokens) for this route.
  * @return {!Object}
  * @protected
  */


		_createClass(Route, [{
			key: 'buildParsedData_',
			value: function buildParsedData_() {
				if (!this.parsedData_) {
					var tokens = (0, _pathParser.parse)(this.path);
					var regex = (0, _pathParser.toRegex)(tokens);
					this.parsedData_ = {
						regex: regex,
						tokens: tokens
					};
				}
				return this.parsedData_;
			}
		}, {
			key: 'extractParams',
			value: function extractParams(path) {
				if ((0, _metal.isString)(this.path)) {
					return (0, _pathParser.extractData)(this.buildParsedData_().tokens, path);
				}
				return {};
			}
		}, {
			key: 'getHandler',
			value: function getHandler() {
				return this.handler;
			}
		}, {
			key: 'getPath',
			value: function getPath() {
				return this.path;
			}
		}, {
			key: 'matchesPath',
			value: function matchesPath(value) {
				var path = this.path;

				if ((0, _metal.isFunction)(path)) {
					return path(value);
				}
				if ((0, _metal.isString)(path)) {
					path = this.buildParsedData_().regex;
				}
				if (path instanceof RegExp) {
					return value.search(path) > -1;
				}

				return false;
			}
		}]);

		return Route;
	}();

	exports.default = Route;
});
//# sourceMappingURL=Route.js.map
