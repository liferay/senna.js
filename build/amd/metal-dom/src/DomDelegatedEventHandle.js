define(['exports', 'metal/src/metal', './domData', 'metal-events/src/events'], function (exports, _metal, _domData, _events) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _domData2 = _interopRequireDefault(_domData);

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

	var DomDelegatedEventHandle = function (_EventHandle) {
		_inherits(DomDelegatedEventHandle, _EventHandle);

		/**
   * The constructor for `DomDelegatedEventHandle`.
   * @param {!Event} emitter Element the event was subscribed to.
   * @param {string} event The name of the event that was subscribed to.
   * @param {!Function} listener The listener subscribed to the event.
   * @param {string=} opt_selector An optional selector used when delegating
   *     the event.
   * @constructor
   */

		function DomDelegatedEventHandle(emitter, event, listener, opt_selector) {
			_classCallCheck(this, DomDelegatedEventHandle);

			var _this = _possibleConstructorReturn(this, _EventHandle.call(this, emitter, event, listener));

			_this.selector_ = opt_selector;
			return _this;
		}

		/**
   * @inheritDoc
   */


		DomDelegatedEventHandle.prototype.removeListener = function removeListener() {
			var data = _domData2.default.get(this.emitter_);
			var selector = this.selector_;
			var arr = _metal.core.isString(selector) ? data.delegating[this.event_].selectors : data.listeners;
			var key = _metal.core.isString(selector) ? selector : this.event_;

			_metal.array.remove(arr[key] || [], this.listener_);
			if (arr[key] && arr[key].length === 0) {
				delete arr[key];
			}
		};

		return DomDelegatedEventHandle;
	}(_events.EventHandle);

	exports.default = DomDelegatedEventHandle;
});
//# sourceMappingURL=DomDelegatedEventHandle.js.map