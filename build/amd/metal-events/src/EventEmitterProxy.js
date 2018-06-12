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

		/**
   * @param {EventEmitter} originEmitter Events originated on this emitter
   * will be fired for the target emitter's listeners as well.
   * @param {EventEmitter} targetEmitter Event listeners attached to this emitter
   * will also be triggered when the event is fired by the origin emitter.
   * @param {Object} blacklist Optional blacklist of events that should not be
   * proxied.
   * @param {Object} whitelist
   */
		function EventEmitterProxy(originEmitter, targetEmitter, blacklist, whitelist) {
			_classCallCheck(this, EventEmitterProxy);

			var _this = _possibleConstructorReturn(this, (EventEmitterProxy.__proto__ || Object.getPrototypeOf(EventEmitterProxy)).call(this));

			/**
    * Map of events that should not be proxied.
    * @type {Object}
    * @protected
    */
			_this.blacklist_ = blacklist;

			/**
    * The origin emitter. This emitter's events will be proxied through the
    * target emitter.
    * @type {EventEmitter}
    * @protected
    */
			_this.originEmitter_ = originEmitter;

			/**
    * A list of events that are pending to be listened by an actual origin
    * emitter. Events are stored here when the origin doesn't exist, so they
    * can be set on a new origin when one is set.
    * @type {Array}
    * @protected
    */
			_this.pendingEvents_ = null;

			/**
    * Holds a map of events from the origin emitter that are already being proxied.
    * @type {Object<string, !EventHandle>}
    * @protected
    */
			_this.proxiedEvents_ = null;

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
			_this.whitelist_ = whitelist;

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


		_createClass(EventEmitterProxy, [{
			key: 'addListener_',
			value: function addListener_(event, listener) {
				return this.originEmitter_.on(event, listener);
			}
		}, {
			key: 'disposeInternal',
			value: function disposeInternal() {
				this.removeListeners_();
				this.proxiedEvents_ = null;
				this.originEmitter_ = null;
				this.targetEmitter_ = null;
			}
		}, {
			key: 'emitOnTarget_',
			value: function emitOnTarget_() {
				var _targetEmitter_;

				(_targetEmitter_ = this.targetEmitter_).emit.apply(_targetEmitter_, arguments);
			}
		}, {
			key: 'proxyEvent',
			value: function proxyEvent(event) {
				if (this.shouldProxyEvent_(event)) {
					this.tryToAddListener_(event);
				}
			}
		}, {
			key: 'removeListeners_',
			value: function removeListeners_() {
				if (this.proxiedEvents_) {
					var events = Object.keys(this.proxiedEvents_);
					for (var i = 0; i < events.length; i++) {
						this.proxiedEvents_[events[i]].removeListener();
					}
					this.proxiedEvents_ = null;
				}
				this.pendingEvents_ = null;
			}
		}, {
			key: 'setOriginEmitter',
			value: function setOriginEmitter(originEmitter) {
				var _this2 = this;

				var events = this.originEmitter_ && this.proxiedEvents_ ? Object.keys(this.proxiedEvents_) : this.pendingEvents_;
				this.originEmitter_ = originEmitter;
				if (events) {
					this.removeListeners_();
					events.forEach(function (event) {
						return _this2.proxyEvent(event);
					});
				}
			}
		}, {
			key: 'shouldProxyEvent_',
			value: function shouldProxyEvent_(event) {
				if (this.whitelist_ && !this.whitelist_[event]) {
					return false;
				}
				if (this.blacklist_ && this.blacklist_[event]) {
					return false;
				}
				return !this.proxiedEvents_ || !this.proxiedEvents_[event];
			}
		}, {
			key: 'startProxy_',
			value: function startProxy_() {
				this.targetEmitter_.onListener(this.proxyEvent.bind(this));
			}
		}, {
			key: 'tryToAddListener_',
			value: function tryToAddListener_(event) {
				if (this.originEmitter_) {
					this.proxiedEvents_ = this.proxiedEvents_ || {};
					this.proxiedEvents_[event] = this.addListener_(event, this.emitOnTarget_.bind(this, event));
				} else {
					this.pendingEvents_ = this.pendingEvents_ || [];
					this.pendingEvents_.push(event);
				}
			}
		}]);

		return EventEmitterProxy;
	}(_metal.Disposable);

	exports.default = EventEmitterProxy;
});
//# sourceMappingURL=EventEmitterProxy.js.map
