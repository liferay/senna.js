define(['exports', 'metal/src/metal'], function (exports, _metal) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var Route = function () {

		/**
   * Route class.
   * @param {!string|RegExp|Function} path
   * @param {!Function} handler
   * @constructor
   */

		function Route(path, handler) {
			_classCallCheck(this, Route);

			if (!_metal.core.isDefAndNotNull(path)) {
				throw new Error('Route path not specified.');
			}
			if (!_metal.core.isFunction(handler)) {
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
   * Gets the route handler.
   * @return {!Function}
   */


		Route.prototype.getHandler = function getHandler() {
			return this.handler;
		};

		Route.prototype.getPath = function getPath() {
			return this.path;
		};

		Route.prototype.matchesPath = function matchesPath(value) {
			var path = this.path;

			if (_metal.core.isString(path)) {
				return value === path;
			}
			if (_metal.core.isFunction(path)) {
				return path(value);
			}
			if (path instanceof RegExp) {
				return value.search(path) > -1;
			}

			return false;
		};

		return Route;
	}();

	exports.default = Route;
});
//# sourceMappingURL=Route.js.map