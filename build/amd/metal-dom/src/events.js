define(['metal/src/metal', './dom', './features'], function (_metal, _dom, _features) {
	'use strict';

	var _features2 = _interopRequireDefault(_features);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	/**
  * Register custom events for event delegation.
  */
	function registerEvents() {
		var mouseEventMap = {
			mouseenter: 'mouseover',
			mouseleave: 'mouseout',
			pointerenter: 'pointerover',
			pointerleave: 'pointerout'
		};
		Object.keys(mouseEventMap).forEach(function (eventName) {
			(0, _dom.registerCustomEvent)(eventName, {
				delegate: true,
				handler: function handler(callback, event) {
					var related = event.relatedTarget;
					var target = event.delegateTarget;
					// eslint-disable-next-line
					if (!related || related !== target && !(0, _dom.contains)(target, related)) {
						event.customType = eventName;
						return callback(event);
					}
				},
				originalEvent: mouseEventMap[eventName]
			});
		});

		var animationEventMap = {
			animation: 'animationend',
			transition: 'transitionend'
		};
		Object.keys(animationEventMap).forEach(function (eventType) {
			var eventName = animationEventMap[eventType];
			(0, _dom.registerCustomEvent)(eventName, {
				event: true,
				delegate: true,
				handler: function handler(callback, event) {
					event.customType = eventName;
					return callback(event);
				},
				originalEvent: _features2.default.checkAnimationEventName()[eventType]
			});
		});
	}

	if (!(0, _metal.isServerSide)()) {
		registerEvents();
	}
});
//# sourceMappingURL=events.js.map
