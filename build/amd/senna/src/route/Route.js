'use strict';

define(['exports', 'metal/src/core'], function (exports, _core) {
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

	var Route = function () {
		function Route(path, handler) {
			_classCallCheck(this, Route);

			if (!_core2.default.isDefAndNotNull(path)) {
				throw new Error('Route path not specified.');
			}

			if (!_core2.default.isFunction(handler)) {
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

			if (_core2.default.isString(path)) {
				return value === path;
			}

			if (_core2.default.isFunction(path)) {
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