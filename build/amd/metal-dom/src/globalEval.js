define(['exports', 'metal/src/metal', './dom'], function (exports, _metal, _dom) {
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

	var globalEval = function () {
		function globalEval() {
			_classCallCheck(this, globalEval);
		}

		_createClass(globalEval, null, [{
			key: 'run',
			value: function run(text, appendFn) {
				var script = document.createElement('script');
				script.text = text;
				if (appendFn) {
					appendFn(script);
				} else {
					document.head.appendChild(script);
				}
				(0, _dom.exitDocument)(script);
				return script;
			}
		}, {
			key: 'runFile',
			value: function runFile(src, defaultFn, appendFn) {
				var script = document.createElement('script');
				script.src = src;

				var callback = function callback() {
					(0, _dom.exitDocument)(script);
					defaultFn && defaultFn();
				};
				(0, _dom.once)(script, 'load', callback);
				(0, _dom.once)(script, 'error', callback);

				if (appendFn) {
					appendFn(script);
				} else {
					document.head.appendChild(script);
				}

				return script;
			}
		}, {
			key: 'runScript',
			value: function runScript(script, defaultFn, appendFn) {
				var callback = function callback() {
					defaultFn && defaultFn();
				};
				if (script.type && script.type !== 'text/javascript') {
					_metal.async.nextTick(callback);
					return;
				}
				(0, _dom.exitDocument)(script);
				if (script.src) {
					return globalEval.runFile(script.src, defaultFn, appendFn);
				} else {
					_metal.async.nextTick(callback);
					return globalEval.run(script.text, appendFn);
				}
			}
		}, {
			key: 'runScriptsInElement',
			value: function runScriptsInElement(element, defaultFn, appendFn) {
				var scripts = element.querySelectorAll('script');
				if (scripts.length) {
					globalEval.runScriptsInOrder(scripts, 0, defaultFn, appendFn);
				} else if (defaultFn) {
					_metal.async.nextTick(defaultFn);
				}
			}
		}, {
			key: 'runScriptsInOrder',
			value: function runScriptsInOrder(scripts, index, defaultFn, appendFn) {
				globalEval.runScript(scripts.item(index), function () {
					if (index < scripts.length - 1) {
						globalEval.runScriptsInOrder(scripts, index + 1, defaultFn, appendFn); // eslint-disable-line
					} else if (defaultFn) {
						_metal.async.nextTick(defaultFn);
					}
				}, appendFn);
			}
		}]);

		return globalEval;
	}();

	exports.default = globalEval;
});
//# sourceMappingURL=globalEval.js.map
