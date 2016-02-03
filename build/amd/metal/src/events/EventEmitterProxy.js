var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

define(['exports', '../core', '../dom/dom', '../disposable/Disposable'], function (exports, _core, _dom, _Disposable2) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _core2 = _interopRequireDefault(_core);

	var _dom2 = _interopRequireDefault(_dom);

	var _Disposable3 = _interopRequireDefault(_Disposable2);

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

		return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
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

	var EventEmitterProxy = function (_Disposable) {
		_inherits(EventEmitterProxy, _Disposable);

		function EventEmitterProxy(originEmitter, targetEmitter, opt_blacklist, opt_whitelist) {
			_classCallCheck(this, EventEmitterProxy);

			var _this = _possibleConstructorReturn(this, _Disposable.call(this));

			_this.blacklist_ = opt_blacklist || {};
			_this.originEmitter_ = originEmitter;
			_this.proxiedEvents_ = {};
			_this.targetEmitter_ = targetEmitter;
			_this.whitelist_ = opt_whitelist;

			_this.startProxy_();

			return _this;
		}

		EventEmitterProxy.prototype.disposeInternal = function disposeInternal() {
			var removeFnName = this.originEmitter_.removeEventListener ? 'removeEventListener' : 'removeListener';

			for (var event in this.proxiedEvents_) {
				this.originEmitter_[removeFnName](event, this.proxiedEvents_[event]);
			}

			this.proxiedEvents_ = null;
			this.originEmitter_ = null;
			this.targetEmitter_ = null;
		};

		EventEmitterProxy.prototype.proxyEvent_ = function proxyEvent_(event) {
			if (!this.shouldProxyEvent_(event)) {
				return;
			}

			var self = this;

			this.proxiedEvents_[event] = function () {
				var args = [event].concat(Array.prototype.slice.call(arguments, 0));
				self.targetEmitter_.emit.apply(self.targetEmitter_, args);
			};

			if (_core2.default.isElement(this.originEmitter_) || _core2.default.isDocument(this.originEmitter_)) {
				_dom2.default.on(this.originEmitter_, event, this.proxiedEvents_[event]);
			} else {
				this.originEmitter_.on(event, this.proxiedEvents_[event]);
			}
		};

		EventEmitterProxy.prototype.shouldProxyEvent_ = function shouldProxyEvent_(event) {
			if (this.whitelist_ && !this.whitelist_[event]) {
				return false;
			}

			if (this.blacklist_[event]) {
				return false;
			}

			return !this.proxiedEvents_[event] && (!(this.originEmitter_.removeEventListener || this.originEmitter_.addEventListener) || _dom2.default.supportsEvent(this.originEmitter_, event));
		};

		EventEmitterProxy.prototype.startProxy_ = function startProxy_() {
			this.targetEmitter_.on('newListener', this.proxyEvent_.bind(this));
		};

		return EventEmitterProxy;
	}(_Disposable3.default);

	EventEmitterProxy.prototype.registerMetalComponent && EventEmitterProxy.prototype.registerMetalComponent(EventEmitterProxy, 'EventEmitterProxy')
	exports.default = EventEmitterProxy;
});
//# sourceMappingURL=EventEmitterProxy.js.map