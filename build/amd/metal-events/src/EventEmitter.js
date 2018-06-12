define(['exports', 'metal/src/metal', './EventHandle'], function (exports, _metal, _EventHandle) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _EventHandle2 = _interopRequireDefault(_EventHandle);

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

	var singleArray_ = [0];

	/**
  * EventEmitter utility.
  * @extends {Disposable}
  */

	var EventEmitter = function (_Disposable) {
		_inherits(EventEmitter, _Disposable);

		/**
   * EventEmitter constructor
   */
		function EventEmitter() {
			_classCallCheck(this, EventEmitter);

			var _this = _possibleConstructorReturn(this, (EventEmitter.__proto__ || Object.getPrototypeOf(EventEmitter)).call(this));

			/**
    * Holds event listeners scoped by event type.
    * @type {Object<string, !Array<!function()>>}
    * @protected
    */
			_this.events_ = null;

			/**
    * Handlers that are triggered when an event is listened to.
    * @type {Array}
    */
			_this.listenerHandlers_ = null;

			/**
    * Configuration option which determines if an event facade should be sent
    * as a param of listeners when emitting events. If set to true, the facade
    * will be passed as the first argument of the listener.
    * @type {boolean}
    * @protected
    */
			_this.shouldUseFacade_ = false;
			return _this;
		}

		/**
   * Adds a handler to given holder variable. If the holder doesn't have a
   * value yet, it will receive the handler directly. If the holder is an array,
   * the value will just be added to it. Otherwise, the holder will be set to a
   * new array containing its previous value plus the new handler.
   * @param {*} holder
   * @param {!function()|Object} handler
   * @return {*} The holder's new value.
   * @protected
   */


		_createClass(EventEmitter, [{
			key: 'addHandler_',
			value: function addHandler_(holder, handler) {
				if (!holder) {
					holder = handler;
				} else {
					if (!Array.isArray(holder)) {
						holder = [holder];
					}
					holder.push(handler);
				}
				return holder;
			}
		}, {
			key: 'addListener',
			value: function addListener(event, listener, defaultListener) {
				this.validateListener_(listener);

				var events = this.toEventsArray_(event);
				for (var i = 0; i < events.length; i++) {
					this.addSingleListener_(events[i], listener, defaultListener);
				}

				return new _EventHandle2.default(this, event, listener);
			}
		}, {
			key: 'addSingleListener_',
			value: function addSingleListener_(event, listener, defaultListener, origin) {
				this.runListenerHandlers_(event);
				if (defaultListener || origin) {
					listener = {
						default: defaultListener,
						fn: listener,
						origin: origin
					};
				}
				this.events_ = this.events_ || {};
				this.events_[event] = this.addHandler_(this.events_[event], listener);
			}
		}, {
			key: 'buildFacade_',
			value: function buildFacade_(event) {
				if (this.getShouldUseFacade()) {
					var facade = {
						preventDefault: function preventDefault() {
							facade.preventedDefault = true;
						},
						target: this,
						type: event
					};
					return facade;
				}
			}
		}, {
			key: 'disposeInternal',
			value: function disposeInternal() {
				this.events_ = null;
			}
		}, {
			key: 'emit',
			value: function emit(event) {
				var listeners = this.getRawListeners_(event);
				if (listeners.length === 0) {
					return false;
				}

				var args = _metal.array.slice(arguments, 1); // eslint-disable-line
				this.runListeners_(listeners, args, this.buildFacade_(event));
				return true;
			}
		}, {
			key: 'getRawListeners_',
			value: function getRawListeners_(event) {
				var directListeners = toArray(this.events_ && this.events_[event]);
				return directListeners.concat(toArray(this.events_ && this.events_['*']));
			}
		}, {
			key: 'getShouldUseFacade',
			value: function getShouldUseFacade() {
				return this.shouldUseFacade_;
			}
		}, {
			key: 'listeners',
			value: function listeners(event) {
				return this.getRawListeners_(event).map(function (listener) {
					return listener.fn ? listener.fn : listener;
				});
			}
		}, {
			key: 'many',
			value: function many(event, amount, listener) {
				var events = this.toEventsArray_(event);
				for (var i = 0; i < events.length; i++) {
					this.many_(events[i], amount, listener);
				}

				return new _EventHandle2.default(this, event, listener);
			}
		}, {
			key: 'many_',
			value: function many_(event, amount, listener) {
				var self = this;

				if (amount <= 0) {
					return;
				}

				/**
     *
     */
				function handlerInternal() {
					if (--amount === 0) {
						self.removeListener(event, handlerInternal);
					}
					listener.apply(self, arguments); // eslint-disable-line
				}

				self.addSingleListener_(event, handlerInternal, false, listener);
			}
		}, {
			key: 'matchesListener_',
			value: function matchesListener_(listenerObj, listener) {
				var fn = listenerObj.fn || listenerObj;
				return fn === listener || listenerObj.origin && listenerObj.origin === listener // eslint-disable-line
				;
			}
		}, {
			key: 'off',
			value: function off(event, listener) {
				this.validateListener_(listener);
				if (!this.events_) {
					return this;
				}

				var events = this.toEventsArray_(event);
				for (var i = 0; i < events.length; i++) {
					this.events_[events[i]] = this.removeMatchingListenerObjs_(toArray(this.events_[events[i]]), listener);
				}

				return this;
			}
		}, {
			key: 'on',
			value: function on() {
				return this.addListener.apply(this, arguments); // eslint-disable-line
			}
		}, {
			key: 'onListener',
			value: function onListener(handler) {
				this.listenerHandlers_ = this.addHandler_(this.listenerHandlers_, handler); // eslint-disable-line
			}
		}, {
			key: 'once',
			value: function once(events, listener) {
				return this.many(events, 1, listener);
			}
		}, {
			key: 'removeAllListeners',
			value: function removeAllListeners(event) {
				if (this.events_) {
					if (event) {
						var events = this.toEventsArray_(event);
						for (var i = 0; i < events.length; i++) {
							this.events_[events[i]] = null;
						}
					} else {
						this.events_ = null;
					}
				}
				return this;
			}
		}, {
			key: 'removeMatchingListenerObjs_',
			value: function removeMatchingListenerObjs_(listenerObjs, listener) {
				var finalListeners = [];
				for (var i = 0; i < listenerObjs.length; i++) {
					if (!this.matchesListener_(listenerObjs[i], listener)) {
						finalListeners.push(listenerObjs[i]);
					}
				}
				return finalListeners.length > 0 ? finalListeners : null;
			}
		}, {
			key: 'removeListener',
			value: function removeListener() {
				return this.off.apply(this, arguments); // eslint-disable-line
			}
		}, {
			key: 'runListenerHandlers_',
			value: function runListenerHandlers_(event) {
				var handlers = this.listenerHandlers_;
				if (handlers) {
					handlers = toArray(handlers);
					for (var i = 0; i < handlers.length; i++) {
						handlers[i](event);
					}
				}
			}
		}, {
			key: 'runListeners_',
			value: function runListeners_(listeners, args, facade) {
				if (facade) {
					args.push(facade);
				}

				var defaultListeners = [];
				for (var i = 0; i < listeners.length; i++) {
					var listener = listeners[i].fn || listeners[i];
					if (listeners[i].default) {
						defaultListeners.push(listener);
					} else {
						listener.apply(this, args);
					}
				}
				if (!facade || !facade.preventedDefault) {
					for (var j = 0; j < defaultListeners.length; j++) {
						defaultListeners[j].apply(this, args);
					}
				}
			}
		}, {
			key: 'setShouldUseFacade',
			value: function setShouldUseFacade(shouldUseFacade) {
				this.shouldUseFacade_ = shouldUseFacade;
				return this;
			}
		}, {
			key: 'toEventsArray_',
			value: function toEventsArray_(events) {
				if ((0, _metal.isString)(events)) {
					singleArray_[0] = events;
					events = singleArray_;
				}
				return events;
			}
		}, {
			key: 'validateListener_',
			value: function validateListener_(listener) {
				if (!(0, _metal.isFunction)(listener)) {
					throw new TypeError('Listener must be a function');
				}
			}
		}]);

		return EventEmitter;
	}(_metal.Disposable);

	/**
  * Converts to an array
  * @param {Object} val
  * @return {Array}
  */
	function toArray(val) {
		val = val || [];
		return Array.isArray(val) ? val : [val];
	}

	exports.default = EventEmitter;
});
//# sourceMappingURL=EventEmitter.js.map
