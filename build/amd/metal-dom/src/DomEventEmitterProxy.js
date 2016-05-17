define(['exports', './dom', 'metal-events/src/events'], function (exports, _dom, _events) {
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

	var DomEventEmitterProxy = function (_EventEmitterProxy) {
		_inherits(DomEventEmitterProxy, _EventEmitterProxy);

		function DomEventEmitterProxy() {
			_classCallCheck(this, DomEventEmitterProxy);

			return _possibleConstructorReturn(this, _EventEmitterProxy.apply(this, arguments));
		}

		DomEventEmitterProxy.prototype.addListener_ = function addListener_(event, listener) {
			if (this.originEmitter_.addEventListener) {
				if (this.isDelegateEvent_(event)) {
					var index = event.indexOf(':', 9);
					var eventName = event.substring(9, index);
					var selector = event.substring(index + 1);
					return _dom2.default.delegate(this.originEmitter_, eventName, selector, listener);
				} else {
					return _dom2.default.on(this.originEmitter_, event, listener);
				}
			} else {
				return _EventEmitterProxy.prototype.addListener_.call(this, event, listener);
			}
		};

		DomEventEmitterProxy.prototype.isDelegateEvent_ = function isDelegateEvent_(event) {
			return event.substr(0, 9) === 'delegate:';
		};

		DomEventEmitterProxy.prototype.isSupportedDomEvent_ = function isSupportedDomEvent_(event) {
			if (!this.originEmitter_ || !this.originEmitter_.addEventListener) {
				return true;
			}
			return this.isDelegateEvent_(event) && event.indexOf(':', 9) !== -1 || _dom2.default.supportsEvent(this.originEmitter_, event);
		};

		DomEventEmitterProxy.prototype.shouldProxyEvent_ = function shouldProxyEvent_(event) {
			return _EventEmitterProxy.prototype.shouldProxyEvent_.call(this, event) && this.isSupportedDomEvent_(event);
		};

		return DomEventEmitterProxy;
	}(_events.EventEmitterProxy);

	exports.default = DomEventEmitterProxy;
});
//# sourceMappingURL=DomEventEmitterProxy.js.map