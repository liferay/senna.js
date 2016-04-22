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

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var EventHandle = function (_Disposable) {
		_inherits(EventHandle, _Disposable);

		function EventHandle(emitter, event, listener) {
			_classCallCheck(this, EventHandle);

			var _this = _possibleConstructorReturn(this, _Disposable.call(this));

			/**
    * The EventEmitter instance that the event was subscribed to.
    * @type {EventEmitter}
    * @protected
    */
			_this.emitter_ = emitter;

			/**
    * The name of the event that was subscribed to.
    * @type {string}
    * @protected
    */
			_this.event_ = event;

			/**
    * The listener subscribed to the event.
    * @type {Function}
    * @protected
    */
			_this.listener_ = listener;
			return _this;
		}

		/**
   * Disposes of this instance's object references.
   * @override
   */


		EventHandle.prototype.disposeInternal = function disposeInternal() {
			this.removeListener();
			this.emitter_ = null;
			this.listener_ = null;
		};

		EventHandle.prototype.removeListener = function removeListener() {
			if (!this.emitter_.isDisposed()) {
				this.emitter_.removeListener(this.event_, this.listener_);
			}
		};

		return EventHandle;
	}(_metal.Disposable);

	exports.default = EventHandle;
});
//# sourceMappingURL=EventHandle.js.map