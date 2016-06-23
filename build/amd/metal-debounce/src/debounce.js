define(['exports'], function (exports) {
	'use strict';

	/**
   * Debounces function execution.
   * @param {!function()} fn
   * @param {number} delay
   * @return {!function()}
   */

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function debounce(fn, delay) {
		return function debounced() {
			var args = arguments;
			cancelDebounce(debounced);
			debounced.id = setTimeout(function () {
				fn.apply(null, args);
			}, delay);
		};
	}

	/**
  * Cancels the scheduled debounced function.
  */
	function cancelDebounce(debounced) {
		clearTimeout(debounced.id);
	}

	exports.default = debounce;
	exports.cancelDebounce = cancelDebounce;
	exports.debounce = debounce;
});
//# sourceMappingURL=debounce.js.map