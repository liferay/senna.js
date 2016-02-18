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

	var EventEmitterProxy = function (_Disposable) {
		_inherits(EventEmitterProxy, _Disposable);

		function EventEmitterProxy(originEmitter, targetEmitter, opt_blacklist, opt_whitelist) {
			_classCallCheck(this, EventEmitterProxy);

			var _this = _possibleConstructorReturn(this, _Disposable.call(this));

			/**
    * Map of events that should not be proxied.
    * @type {Object}
    * @protected
    */
			_this.blacklist_ = opt_blacklist || {};

			/**
    * The origin emitter. This emitter's events will be proxied through the
    * target emitter.
    * @type {EventEmitter}
    * @protected
    */
			_this.originEmitter_ = originEmitter;

			/**
    * Holds a map of events from the origin emitter that are already being proxied.
    * @type {Object}
    * @protected
    */
			_this.proxiedEvents_ = {};

			/**
    * The target emitter. This emitter will emit all events that come from
    * the origin emitter.
    * @type {EventEmitter}
    * @protected
    */
			_this.targetEmitter_ = targetEmitter;

			/**
    * Map of events that should be proxied. If whitelist is set blacklist is ignored.
    * @type {Object}
    * @protected
    */
			_this.whitelist_ = opt_whitelist;

			_this.startProxy_();
			return _this;
		}

		/**
   * Adds the proxy listener for the given event.
   * @param {string} event.
   * @protected
   */


		EventEmitterProxy.prototype.addListener_ = function addListener_(event) {
			this.originEmitter_.on(event, this.proxiedEvents_[event]);
		};

		EventEmitterProxy.prototype.disposeInternal = function disposeInternal() {
			_metal.object.map(this.proxiedEvents_, this.removeListener_.bind(this));
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

			this.addListener_(event);
		};

		EventEmitterProxy.prototype.removeListener_ = function removeListener_(event) {
			this.originEmitter_.removeListener(event, this.proxiedEvents_[event]);
		};

		EventEmitterProxy.prototype.shouldProxyEvent_ = function shouldProxyEvent_(event) {
			if (this.whitelist_ && !this.whitelist_[event]) {
				return false;
			}
			if (this.blacklist_[event]) {
				return false;
			}
			return !this.proxiedEvents_[event];
		};

		EventEmitterProxy.prototype.startProxy_ = function startProxy_() {
			this.targetEmitter_.on('newListener', this.proxyEvent_.bind(this));
		};

		return EventEmitterProxy;
	}(_metal.Disposable);

	EventEmitterProxy.prototype.registerMetalComponent && EventEmitterProxy.prototype.registerMetalComponent(EventEmitterProxy, 'EventEmitterProxy')
	exports.default = EventEmitterProxy;
});
//# sourceMappingURL=EventEmitterProxy.js.map