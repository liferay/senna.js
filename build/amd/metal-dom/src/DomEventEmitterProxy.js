define(['exports', './dom', 'metal-events/src/events'], function (exports, _dom, _events) {
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

	var _get = function get(object, property, receiver) {
		if (object === null) object = Function.prototype;
		var desc = Object.getOwnPropertyDescriptor(object, property);

		if (desc === undefined) {
			var parent = Object.getPrototypeOf(object);

			if (parent === null) {
				return undefined;
			} else {
				return get(parent, property, receiver);
			}
		} else if ("value" in desc) {
			return desc.value;
		} else {
			var getter = desc.get;

			if (getter === undefined) {
				return undefined;
			}

			return getter.call(receiver);
		}
	};

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

			return _possibleConstructorReturn(this, (DomEventEmitterProxy.__proto__ || Object.getPrototypeOf(DomEventEmitterProxy)).apply(this, arguments));
		}

		_createClass(DomEventEmitterProxy, [{
			key: 'addListener_',
			value: function addListener_(event, listener) {
				if (this.originEmitter_.addEventListener) {
					if (this.isDelegateEvent_(event)) {
						var index = event.indexOf(':', 9);
						var eventName = event.substring(9, index);
						var selector = event.substring(index + 1);
						return (0, _dom.delegate)(this.originEmitter_, eventName, selector, listener); // eslint-disable-line
					} else {
						return (0, _dom.on)(this.originEmitter_, event, listener);
					}
				} else {
					return _get(DomEventEmitterProxy.prototype.__proto__ || Object.getPrototypeOf(DomEventEmitterProxy.prototype), 'addListener_', this).call(this, event, listener);
				}
			}
		}, {
			key: 'isDelegateEvent_',
			value: function isDelegateEvent_(event) {
				return event.substr(0, 9) === 'delegate:';
			}
		}, {
			key: 'isSupportedDomEvent_',
			value: function isSupportedDomEvent_(event) {
				if (!this.originEmitter_ || !this.originEmitter_.addEventListener) {
					return true;
				}
				return this.isDelegateEvent_(event) && event.indexOf(':', 9) !== -1 || (0, _dom.supportsEvent)(this.originEmitter_, event);
			}
		}, {
			key: 'shouldProxyEvent_',
			value: function shouldProxyEvent_(event) {
				return _get(DomEventEmitterProxy.prototype.__proto__ || Object.getPrototypeOf(DomEventEmitterProxy.prototype), 'shouldProxyEvent_', this).call(this, event) && this.isSupportedDomEvent_(event); // eslint-disable-line
			}
		}]);

		return DomEventEmitterProxy;
	}(_events.EventEmitterProxy);

	exports.default = DomEventEmitterProxy;
});
//# sourceMappingURL=DomEventEmitterProxy.js.map
