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

	var globalEvalStyles = function () {
		function globalEvalStyles() {
			_classCallCheck(this, globalEvalStyles);
		}

		_createClass(globalEvalStyles, null, [{
			key: 'run',
			value: function run(text, appendFn) {
				var style = document.createElement('style');
				style.innerHTML = text;
				if (appendFn) {
					appendFn(style);
				} else {
					document.head.appendChild(style);
				}
				return style;
			}
		}, {
			key: 'runFile',
			value: function runFile(href, defaultFn, appendFn) {
				var link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = href;
				globalEvalStyles.runStyle(link, defaultFn, appendFn);
				return link;
			}
		}, {
			key: 'runStyle',
			value: function runStyle(style, defaultFn, appendFn) {
				var callback = function callback() {
					defaultFn && defaultFn();
				};
				if (style.rel && style.rel !== 'stylesheet' && style.rel !== 'canonical' && style.rel !== 'alternate') {
					_metal.async.nextTick(callback);
					return;
				}

				if (style.tagName === 'STYLE' || style.rel === 'canonical' || style.rel === 'alternate') {
					_metal.async.nextTick(callback);
				} else {
					(0, _dom.once)(style, 'load', callback);
					(0, _dom.once)(style, 'error', callback);
				}

				if (appendFn) {
					appendFn(style);
				} else {
					document.head.appendChild(style);
				}

				return style;
			}
		}, {
			key: 'runStylesInElement',
			value: function runStylesInElement(element, defaultFn, appendFn) {
				var styles = element.querySelectorAll('style,link');
				if (styles.length === 0 && defaultFn) {
					_metal.async.nextTick(defaultFn);
					return;
				}

				var loadCount = 0;
				var callback = function callback() {
					if (defaultFn && ++loadCount === styles.length) {
						_metal.async.nextTick(defaultFn);
					}
				};
				for (var i = 0; i < styles.length; i++) {
					globalEvalStyles.runStyle(styles[i], callback, appendFn);
				}
			}
		}]);

		return globalEvalStyles;
	}();

	exports.default = globalEvalStyles;
});
//# sourceMappingURL=globalEvalStyles.js.map
