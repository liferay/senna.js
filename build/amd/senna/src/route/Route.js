define(['exports', 'metal/src/index'], function (exports, _index) {
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
		function Route(path, handler) {
			_classCallCheck(this, Route);

			if (!_index.core.isDefAndNotNull(path)) {
				throw new Error('Route path not specified.');
			}

			if (!_index.core.isFunction(handler)) {
				throw new Error('Route handler is not a function.');
			}

			this.handler = handler;
			this.path = path;
		}

		Route.prototype.getHandler = function getHandler() {
			return this.handler;
		};

		Route.prototype.getPath = function getPath() {
			return this.path;
		};

		Route.prototype.matchesPath = function matchesPath(value) {
			var path = this.path;

			if (_index.core.isString(path)) {
				return value === path;
			}

			if (_index.core.isFunction(path)) {
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