define(['exports'], function (exports) {
	'use strict';

	/**
  * Disposable utility. When inherited provides the `dispose` function to its
  * subclass, which is responsible for disposing of any object references
  * when an instance won't be used anymore. Subclasses should override
  * `disposeInternal` to implement any specific disposing logic.
  * @constructor
  */

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

	var Disposable = function () {
		/**
   * Disposable constructor
   */
		function Disposable() {
			_classCallCheck(this, Disposable);

			/**
    * Flag indicating if this instance has already been disposed.
    * @type {boolean}
    * @protected
    */
			this.disposed_ = false;
		}

		/**
   * Disposes of this instance's object references. Calls `disposeInternal`.
   */


		_createClass(Disposable, [{
			key: 'dispose',
			value: function dispose() {
				if (!this.disposed_) {
					this.disposeInternal();
					this.disposed_ = true;
				}
			}
		}, {
			key: 'disposeInternal',
			value: function disposeInternal() {}
		}, {
			key: 'isDisposed',
			value: function isDisposed() {
				return this.disposed_;
			}
		}]);

		return Disposable;
	}();

	exports.default = Disposable;
});
//# sourceMappingURL=Disposable.js.map
