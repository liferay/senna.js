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
    * @type {Object<string, !EventHandle>}
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
   * Adds the given listener for the given event.
   * @param {string} event
   * @param {!function()} listener
   * @return {!EventHandle} The listened event's handle.
   * @protected
   */


		EventEmitterProxy.prototype.addListener_ = function addListener_(event, listener) {
			return this.originEmitter_.on(event, listener);
		};

		EventEmitterProxy.prototype.addListenerForEvent_ = function addListenerForEvent_(event) {
			return this.addListener_(event, this.emitOnTarget_.bind(this, event));
		};

		EventEmitterProxy.prototype.disposeInternal = function disposeInternal() {
			this.removeListeners_();
			this.proxiedEvents_ = null;
			this.originEmitter_ = null;
			this.targetEmitter_ = null;
		};

		EventEmitterProxy.prototype.emitOnTarget_ = function emitOnTarget_(eventType) {
			var args = [eventType].concat(_metal.array.slice(arguments, 1));
			this.targetEmitter_.emit.apply(this.targetEmitter_, args);
		};

		EventEmitterProxy.prototype.proxyEvent = function proxyEvent(event) {
			if (this.shouldProxyEvent_(event)) {
				this.proxiedEvents_[event] = this.addListenerForEvent_(event);
			}
		};

		EventEmitterProxy.prototype.removeListeners_ = function removeListeners_() {
			var events = Object.keys(this.proxiedEvents_);
			for (var i = 0; i < events.length; i++) {
				this.proxiedEvents_[events[i]].removeListener();
			}
			this.proxiedEvents_ = {};
		};

		EventEmitterProxy.prototype.setOriginEmitter = function setOriginEmitter(originEmitter) {
			var handles = this.proxiedEvents_;
			this.removeListeners_();
			this.originEmitter_ = originEmitter;

			var events = Object.keys(handles);
			for (var i = 0; i < events.length; i++) {
				this.proxiedEvents_[events[i]] = this.addListenerForEvent_(events[i]);
			}
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
			this.targetEmitter_.on('newListener', this.proxyEvent.bind(this));
		};

		return EventEmitterProxy;
	}(_metal.Disposable);

	exports.default = EventEmitterProxy;
});
//# sourceMappingURL=EventEmitterProxy.js.map