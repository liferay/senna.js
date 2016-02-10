define(['exports', 'metal/src/metal', './dom'], function (exports, _metal, _dom) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _dom2 = _interopRequireDefault(_dom);

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

	var globalEval = function () {
		function globalEval() {
			_classCallCheck(this, globalEval);
		}

		globalEval.run = function run(text) {
			var script = document.createElement('script');
			script.text = text;
			document.head.appendChild(script).parentNode.removeChild(script);
			return script;
		};

		globalEval.runFile = function runFile(src, opt_callback) {
			var script = document.createElement('script');
			script.src = src;

			var callback = function callback() {
				script.parentNode.removeChild(script);
				opt_callback && opt_callback();
			};

			_dom2.default.on(script, 'load', callback);

			_dom2.default.on(script, 'error', callback);

			document.head.appendChild(script);
			return script;
		};

		globalEval.runScript = function runScript(script, opt_callback) {
			var callback = function callback() {
				opt_callback && opt_callback();
			};

			if (script.type && script.type !== 'text/javascript') {
				_metal.async.nextTick(callback);

				return;
			}

			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}

			if (script.src) {
				return globalEval.runFile(script.src, opt_callback);
			} else {
				_metal.async.nextTick(callback);

				return globalEval.run(script.text);
			}
		};

		globalEval.runScriptsInElement = function runScriptsInElement(element, opt_callback) {
			var scripts = element.querySelectorAll('script');

			if (scripts.length) {
				globalEval.runScriptsInOrder(scripts, 0, opt_callback);
			} else if (opt_callback) {
				_metal.async.nextTick(opt_callback);
			}
		};

		globalEval.runScriptsInOrder = function runScriptsInOrder(scripts, index, opt_callback) {
			globalEval.runScript(scripts.item(index), function () {
				if (index < scripts.length - 1) {
					globalEval.runScriptsInOrder(scripts, index + 1, opt_callback);
				} else if (opt_callback) {
					_metal.async.nextTick(opt_callback);
				}
			});
		};

		return globalEval;
	}();

	exports.default = globalEval;
});
//# sourceMappingURL=globalEval.js.map