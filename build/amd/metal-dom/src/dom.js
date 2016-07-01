define(['exports', 'metal/src/metal', './domData', './DomDelegatedEventHandle', './DomEventHandle'], function (exports, _metal, _domData, _DomDelegatedEventHandle, _DomEventHandle) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _domData2 = _interopRequireDefault(_domData);

	var _DomDelegatedEventHandle2 = _interopRequireDefault(_DomDelegatedEventHandle);

	var _DomEventHandle2 = _interopRequireDefault(_DomEventHandle);

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

	var NEXT_TARGET = '__metal_next_target__';
	var USE_CAPTURE = {
		blur: true,
		error: true,
		focus: true,
		invalid: true,
		load: true,
		scroll: true
	};

	var dom = function () {
		function dom() {
			_classCallCheck(this, dom);
		}

		dom.addClasses = function addClasses(element, classes) {
			if (!_metal.core.isObject(element) || !_metal.core.isString(classes)) {
				return;
			}

			if ('classList' in element) {
				dom.addClassesWithNative_(element, classes);
			} else {
				dom.addClassesWithoutNative_(element, classes);
			}
		};

		dom.addClassesWithNative_ = function addClassesWithNative_(element, classes) {
			classes.split(' ').forEach(function (className) {
				if (className) {
					element.classList.add(className);
				}
			});
		};

		dom.addClassesWithoutNative_ = function addClassesWithoutNative_(element, classes) {
			var elementClassName = ' ' + element.className + ' ';
			var classesToAppend = '';

			classes = classes.split(' ');

			for (var i = 0; i < classes.length; i++) {
				var className = classes[i];

				if (elementClassName.indexOf(' ' + className + ' ') === -1) {
					classesToAppend += ' ' + className;
				}
			}

			if (classesToAppend) {
				element.className = element.className + classesToAppend;
			}
		};

		dom.addElementListener_ = function addElementListener_(element, eventName, listener) {
			var data = _domData2.default.get(element);
			dom.addToArr_(data.listeners, eventName, listener);
		};

		dom.addSelectorListener_ = function addSelectorListener_(element, eventName, selector, listener) {
			var data = _domData2.default.get(element);
			dom.addToArr_(data.delegating[eventName].selectors, selector, listener);
		};

		dom.addToArr_ = function addToArr_(arr, key, value) {
			if (!arr[key]) {
				arr[key] = [];
			}
			arr[key].push(value);
		};

		dom.attachDelegateEvent_ = function attachDelegateEvent_(element, eventName) {
			var data = _domData2.default.get(element);
			if (!data.delegating[eventName]) {
				data.delegating[eventName] = {
					handle: dom.on(element, eventName, dom.handleDelegateEvent_, !!USE_CAPTURE[eventName]),
					selectors: {}
				};
			}
		};

		dom.closest = function closest(element, selector) {
			while (element && !dom.match(element, selector)) {
				element = element.parentNode;
			}
			return element;
		};

		dom.append = function append(parent, child) {
			if (_metal.core.isString(child)) {
				child = dom.buildFragment(child);
			}
			if (child instanceof NodeList) {
				var childArr = Array.prototype.slice.call(child);
				for (var i = 0; i < childArr.length; i++) {
					parent.appendChild(childArr[i]);
				}
			} else {
				parent.appendChild(child);
			}
			return child;
		};

		dom.buildFragment = function buildFragment(htmlString) {
			var tempDiv = document.createElement('div');
			tempDiv.innerHTML = '<br>' + htmlString;
			tempDiv.removeChild(tempDiv.firstChild);

			var fragment = document.createDocumentFragment();
			while (tempDiv.firstChild) {
				fragment.appendChild(tempDiv.firstChild);
			}
			return fragment;
		};

		dom.contains = function contains(element1, element2) {
			if (_metal.core.isDocument(element1)) {
				// document.contains is not defined on IE9, so call it on documentElement instead.
				return element1.documentElement.contains(element2);
			} else {
				return element1.contains(element2);
			}
		};

		dom.delegate = function delegate(element, eventName, selectorOrTarget, callback, opt_default) {
			var customConfig = dom.customEvents[eventName];
			if (customConfig && customConfig.delegate) {
				eventName = customConfig.originalEvent;
				callback = customConfig.handler.bind(customConfig, callback);
			}

			if (opt_default) {
				// Wrap callback so we don't set property directly on it.
				callback = callback.bind();
				callback.defaultListener_ = true;
			}

			dom.attachDelegateEvent_(element, eventName);
			if (_metal.core.isString(selectorOrTarget)) {
				dom.addSelectorListener_(element, eventName, selectorOrTarget, callback);
			} else {
				dom.addElementListener_(selectorOrTarget, eventName, callback);
			}

			return new _DomDelegatedEventHandle2.default(_metal.core.isString(selectorOrTarget) ? element : selectorOrTarget, eventName, callback, _metal.core.isString(selectorOrTarget) ? selectorOrTarget : null);
		};

		dom.enterDocument = function enterDocument(node) {
			node && dom.append(document.body, node);
		};

		dom.exitDocument = function exitDocument(node) {
			if (node && node.parentNode) {
				node.parentNode.removeChild(node);
			}
		};

		dom.handleDelegateEvent_ = function handleDelegateEvent_(event) {
			dom.normalizeDelegateEvent_(event);
			var currElement = _metal.core.isDef(event[NEXT_TARGET]) ? event[NEXT_TARGET] : event.target;
			var ret = true;
			var container = event.currentTarget;
			var limit = event.currentTarget.parentNode;
			var defFns = [];

			while (currElement && currElement !== limit && !event.stopped) {
				event.delegateTarget = currElement;
				ret &= dom.triggerMatchedListeners_(container, currElement, event, defFns);
				currElement = currElement.parentNode;
			}

			for (var i = 0; i < defFns.length && !event.defaultPrevented; i++) {
				event.delegateTarget = defFns[i].element;
				ret &= defFns[i].fn(event);
			}

			event.delegateTarget = null;
			event[NEXT_TARGET] = limit;
			return ret;
		};

		dom.hasClass = function hasClass(element, className) {
			if ('classList' in element) {
				return dom.hasClassWithNative_(element, className);
			} else {
				return dom.hasClassWithoutNative_(element, className);
			}
		};

		dom.hasClassWithNative_ = function hasClassWithNative_(element, className) {
			return element.classList.contains(className);
		};

		dom.hasClassWithoutNative_ = function hasClassWithoutNative_(element, className) {
			return (' ' + element.className + ' ').indexOf(' ' + className + ' ') >= 0;
		};

		dom.isEmpty = function isEmpty(element) {
			return element.childNodes.length === 0;
		};

		dom.match = function match(element, selector) {
			if (!element || element.nodeType !== 1) {
				return false;
			}

			var p = Element.prototype;
			var m = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector;
			if (m) {
				return m.call(element, selector);
			}

			return dom.matchFallback_(element, selector);
		};

		dom.matchFallback_ = function matchFallback_(element, selector) {
			var nodes = document.querySelectorAll(selector, element.parentNode);
			for (var i = 0; i < nodes.length; ++i) {
				if (nodes[i] === element) {
					return true;
				}
			}
			return false;
		};

		dom.next = function next(element, selector) {
			do {
				element = element.nextSibling;
				if (element && dom.match(element, selector)) {
					return element;
				}
			} while (element);
			return null;
		};

		dom.normalizeDelegateEvent_ = function normalizeDelegateEvent_(event) {
			event.stopPropagation = dom.stopPropagation_;
			event.stopImmediatePropagation = dom.stopImmediatePropagation_;
		};

		dom.on = function on(element, eventName, callback, opt_capture) {
			if (_metal.core.isString(element)) {
				return dom.delegate(document, eventName, element, callback);
			}
			var customConfig = dom.customEvents[eventName];
			if (customConfig && customConfig.event) {
				eventName = customConfig.originalEvent;
				callback = customConfig.handler.bind(customConfig, callback);
			}
			element.addEventListener(eventName, callback, opt_capture);
			return new _DomEventHandle2.default(element, eventName, callback, opt_capture);
		};

		dom.once = function once(element, eventName, callback) {
			var domEventHandle = this.on(element, eventName, function () {
				domEventHandle.removeListener();
				return callback.apply(this, arguments);
			});
			return domEventHandle;
		};

		dom.parent = function parent(element, selector) {
			return dom.closest(element.parentNode, selector);
		};

		dom.registerCustomEvent = function registerCustomEvent(eventName, customConfig) {
			dom.customEvents[eventName] = customConfig;
		};

		dom.removeChildren = function removeChildren(node) {
			var child;
			while (child = node.firstChild) {
				node.removeChild(child);
			}
		};

		dom.removeClasses = function removeClasses(element, classes) {
			if (!_metal.core.isObject(element) || !_metal.core.isString(classes)) {
				return;
			}

			if ('classList' in element) {
				dom.removeClassesWithNative_(element, classes);
			} else {
				dom.removeClassesWithoutNative_(element, classes);
			}
		};

		dom.removeClassesWithNative_ = function removeClassesWithNative_(element, classes) {
			classes.split(' ').forEach(function (className) {
				if (className) {
					element.classList.remove(className);
				}
			});
		};

		dom.removeClassesWithoutNative_ = function removeClassesWithoutNative_(element, classes) {
			var elementClassName = ' ' + element.className + ' ';

			classes = classes.split(' ');

			for (var i = 0; i < classes.length; i++) {
				elementClassName = elementClassName.replace(' ' + classes[i] + ' ', ' ');
			}

			element.className = elementClassName.trim();
		};

		dom.replace = function replace(element1, element2) {
			if (element1 && element2 && element1 !== element2 && element1.parentNode) {
				element1.parentNode.insertBefore(element2, element1);
				element1.parentNode.removeChild(element1);
			}
		};

		dom.stopImmediatePropagation_ = function stopImmediatePropagation_() {
			this.stopped = true;
			this.stoppedImmediate = true;
			Event.prototype.stopImmediatePropagation.call(this);
		};

		dom.stopPropagation_ = function stopPropagation_() {
			this.stopped = true;
			Event.prototype.stopPropagation.call(this);
		};

		dom.supportsEvent = function supportsEvent(element, eventName) {
			if (dom.customEvents[eventName]) {
				return true;
			}

			if (_metal.core.isString(element)) {
				if (!elementsByTag[element]) {
					elementsByTag[element] = document.createElement(element);
				}
				element = elementsByTag[element];
			}
			return 'on' + eventName in element;
		};

		dom.toElement = function toElement(selectorOrElement) {
			if (_metal.core.isElement(selectorOrElement) || _metal.core.isDocument(selectorOrElement)) {
				return selectorOrElement;
			} else if (_metal.core.isString(selectorOrElement)) {
				if (selectorOrElement[0] === '#' && selectorOrElement.indexOf(' ') === -1) {
					return document.getElementById(selectorOrElement.substr(1));
				} else {
					return document.querySelector(selectorOrElement);
				}
			} else {
				return null;
			}
		};

		dom.toggleClasses = function toggleClasses(element, classes) {
			if (!_metal.core.isObject(element) || !_metal.core.isString(classes)) {
				return;
			}

			if ('classList' in element) {
				dom.toggleClassesWithNative_(element, classes);
			} else {
				dom.toggleClassesWithoutNative_(element, classes);
			}
		};

		dom.toggleClassesWithNative_ = function toggleClassesWithNative_(element, classes) {
			classes.split(' ').forEach(function (className) {
				element.classList.toggle(className);
			});
		};

		dom.toggleClassesWithoutNative_ = function toggleClassesWithoutNative_(element, classes) {
			var elementClassName = ' ' + element.className + ' ';

			classes = classes.split(' ');

			for (var i = 0; i < classes.length; i++) {
				var className = ' ' + classes[i] + ' ';
				var classIndex = elementClassName.indexOf(className);

				if (classIndex === -1) {
					elementClassName = elementClassName + classes[i] + ' ';
				} else {
					elementClassName = elementClassName.substring(0, classIndex) + ' ' + elementClassName.substring(classIndex + className.length);
				}
			}

			element.className = elementClassName.trim();
		};

		dom.triggerEvent = function triggerEvent(element, eventName, opt_eventObj) {
			var eventObj = document.createEvent('HTMLEvents');
			eventObj.initEvent(eventName, true, true);
			_metal.object.mixin(eventObj, opt_eventObj);
			element.dispatchEvent(eventObj);
		};

		dom.triggerListeners_ = function triggerListeners_(listeners, event, element, defaultFns) {
			var ret = true;
			listeners = listeners || [];
			for (var i = 0; i < listeners.length && !event.stoppedImmediate; i++) {
				if (listeners[i].defaultListener_) {
					defaultFns.push({
						element: element,
						fn: listeners[i]
					});
				} else {
					ret &= listeners[i](event);
				}
			}
			return ret;
		};

		dom.triggerMatchedListeners_ = function triggerMatchedListeners_(container, element, event, defaultFns) {
			var data = _domData2.default.get(element);
			var listeners = data.listeners[event.type];
			var ret = dom.triggerListeners_(listeners, event, element, defaultFns);

			var selectorsMap = _domData2.default.get(container).delegating[event.type].selectors;
			var selectors = Object.keys(selectorsMap);
			for (var i = 0; i < selectors.length && !event.stoppedImmediate; i++) {
				if (dom.match(element, selectors[i])) {
					listeners = selectorsMap[selectors[i]];
					ret &= dom.triggerListeners_(listeners, event, element, defaultFns);
				}
			}

			return ret;
		};

		return dom;
	}();

	var elementsByTag = {};
	dom.customEvents = {};

	exports.default = dom;
});
//# sourceMappingURL=dom.js.map