define(['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var Disposable = function () {
		function Disposable() {
			_classCallCheck(this, Disposable);

			this.disposed_ = false;
		}

		Disposable.prototype.dispose = function dispose() {
			if (!this.disposed_) {
				this.disposeInternal();
				this.disposed_ = true;
			}
		};

		Disposable.prototype.disposeInternal = function disposeInternal() {};

		Disposable.prototype.isDisposed = function isDisposed() {
			return this.disposed_;
		};

		return Disposable;
	}();

	exports.default = Disposable;
});
//# sourceMappingURL=Disposable.js.map