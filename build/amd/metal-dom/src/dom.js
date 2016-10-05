define(['exports', 'metal/src/metal', './domData', './DomDelegatedEventHandle', './DomEventHandle'], function (exports, _metal, _domData, _DomDelegatedEventHandle, _DomEventHandle) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.customEvents = undefined;
	exports.addClasses = addClasses;
	exports.closest = closest;
	exports.append = append;
	exports.buildFragment = buildFragment;
	exports.contains = contains;
	exports.delegate = delegate;
	exports.enterDocument = enterDocument;
	exports.exitDocument = exitDocument;
	exports.hasClass = hasClass;
	exports.isEmpty = isEmpty;
	exports.match = match;
	exports.next = next;
	exports.on = on;
	exports.once = once;
	exports.parent = parent;
	exports.registerCustomEvent = registerCustomEvent;
	exports.removeChildren = removeChildren;
	exports.removeClasses = removeClasses;
	exports.replace = replace;
	exports.supportsEvent = supportsEvent;
	exports.toElement = toElement;
	exports.toggleClasses = toggleClasses;
	exports.triggerEvent = triggerEvent;

	var _domData2 = _interopRequireDefault(_domData);

	var _DomDelegatedEventHandle2 = _interopRequireDefault(_DomDelegatedEventHandle);

	var _DomEventHandle2 = _interopRequireDefault(_DomEventHandle);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var elementsByTag_ = {};
	var customEvents = exports.customEvents = {};

	var NEXT_TARGET = '__metal_next_target__';
	var USE_CAPTURE = {
		blur: true,
		error: true,
		focus: true,
		invalid: true,
		load: true,
		scroll: true
	};

	/**
  * Adds the requested CSS classes to an element.
  * @param {!Element|!Nodelist} elements The element or elements to add CSS classes to.
  * @param {string} classes CSS classes to add.
  */
	function addClasses(elements, classes) {
		if (!(0, _metal.isObject)(elements) || !(0, _metal.isString)(classes)) {
			return;
		}

		if (!elements.length) {
			elements = [elements];
		}

		for (var i = 0; i < elements.length; i++) {
			if ('classList' in elements[i]) {
				addClassesWithNative_(elements[i], classes);
			} else {
				addClassesWithoutNative_(elements[i], classes);
			}
		}
	}

	/**
  * Adds the requested CSS classes to an element using classList.
  * @param {!Element} element The element to add CSS classes to.
  * @param {string} classes CSS classes to add.
  * @private
  */
	function addClassesWithNative_(element, classes) {
		classes.split(' ').forEach(function (className) {
			if (className) {
				element.classList.add(className);
			}
		});
	}

	/**
  * Adds the requested CSS classes to an element without using classList.
  * @param {!Element} element The element to add CSS classes to.
  * @param {string} classes CSS classes to add.
  * @private
  */
	function addClassesWithoutNative_(element, classes) {
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
	}

	/**
  * Adds an event listener to the given element, to be triggered via delegate.
  * @param {!Element} element
  * @param {string} eventName
  * @param {!function()} listener
  * @private
  */
	function addElementListener_(element, eventName, listener) {
		var data = _domData2.default.get(element);
		addToArr_(data.listeners, eventName, listener);
	}

	/**
  * Adds an event listener to the given element, to be triggered via delegate
  * selectors.
  * @param {!Element} element
  * @param {string} eventName
  * @param {string} selector
  * @param {!function()} listener
  * @private
  */
	function addSelectorListener_(element, eventName, selector, listener) {
		var data = _domData2.default.get(element);
		addToArr_(data.delegating[eventName].selectors, selector, listener);
	}

	/**
  * Adds a value to an array inside an object, creating it first if it doesn't
  * yet exist.
  * @param {!Array} arr
  * @param {string} key
  * @param {*} value
  * @private
  */
	function addToArr_(arr, key, value) {
		if (!arr[key]) {
			arr[key] = [];
		}
		arr[key].push(value);
	}

	/**
  * Attaches a delegate listener, unless there's already one attached.
  * @param {!Element} element
  * @param {string} eventName
  * @private
  */
	function attachDelegateEvent_(element, eventName) {
		var data = _domData2.default.get(element);
		if (!data.delegating[eventName]) {
			data.delegating[eventName] = {
				handle: on(element, eventName, handleDelegateEvent_, !!USE_CAPTURE[eventName]),
				selectors: {}
			};
		}
	}

	/**
  * Gets the closest element up the tree from the given element (including
  * itself) that matches the specified selector, or null if none match.
  * @param {Element} element
  * @param {string} selector
  * @return {Element}
  */
	function closest(element, selector) {
		while (element && !match(element, selector)) {
			element = element.parentNode;
		}
		return element;
	}

	/**
  * Appends a child node with text or other nodes to a parent node. If
  * child is a HTML string it will be automatically converted to a document
  * fragment before appending it to the parent.
  * @param {!Element} parent The node to append nodes to.
  * @param {!(Element|NodeList|string)} child The thing to append to the parent.
  * @return {!Element} The appended child.
  */
	function append(parent, child) {
		if ((0, _metal.isString)(child)) {
			child = buildFragment(child);
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
	}

	/**
  * Helper for converting a HTML string into a document fragment.
  * @param {string} htmlString The HTML string to convert.
  * @return {!Element} The resulting document fragment.
  */
	function buildFragment(htmlString) {
		var tempDiv = document.createElement('div');
		tempDiv.innerHTML = '<br>' + htmlString;
		tempDiv.removeChild(tempDiv.firstChild);

		var fragment = document.createDocumentFragment();
		while (tempDiv.firstChild) {
			fragment.appendChild(tempDiv.firstChild);
		}
		return fragment;
	}

	/**
  * Checks if the first element contains the second one.
  * @param {!Element} element1
  * @param {!Element} element2
  * @return {boolean}
  */
	function contains(element1, element2) {
		if ((0, _metal.isDocument)(element1)) {
			// document.contains is not defined on IE9, so call it on documentElement instead.
			return element1.documentElement.contains(element2);
		} else {
			return element1.contains(element2);
		}
	}

	/**
  * Listens to the specified event on the given DOM element, but only calls the
  * given callback listener when it's triggered by elements that match the
  * given selector or target element.
  * @param {!Element} element The DOM element the event should be listened on.
  * @param {string} eventName The name of the event to listen to.
  * @param {!Element|string} selectorOrTarget Either an element or css selector
  *     that should match the event for the listener to be triggered.
  * @param {!function(!Object)} callback Function to be called when the event
  *     is triggered. It will receive the normalized event object.
  * @param {boolean=} opt_default Optional flag indicating if this is a default
  *     listener. That means that it would only be executed after all non
  *     default listeners, and only if the event isn't prevented via
  *     `preventDefault`.
  * @return {!EventHandle} Can be used to remove the listener.
  */
	function delegate(element, eventName, selectorOrTarget, callback, opt_default) {
		var customConfig = customEvents[eventName];
		if (customConfig && customConfig.delegate) {
			eventName = customConfig.originalEvent;
			callback = customConfig.handler.bind(customConfig, callback);
		}

		if (opt_default) {
			// Wrap callback so we don't set property directly on it.
			callback = callback.bind();
			callback.defaultListener_ = true;
		}

		attachDelegateEvent_(element, eventName);
		if ((0, _metal.isString)(selectorOrTarget)) {
			addSelectorListener_(element, eventName, selectorOrTarget, callback);
		} else {
			addElementListener_(selectorOrTarget, eventName, callback);
		}

		return new _DomDelegatedEventHandle2.default((0, _metal.isString)(selectorOrTarget) ? element : selectorOrTarget, eventName, callback, (0, _metal.isString)(selectorOrTarget) ? selectorOrTarget : null);
	}

	/**
  * Verifies if the element is able to trigger the Click event,
  * simulating browsers behaviour, avoiding event listeners to be called by triggerEvent method.
  * @param {Element} node Element to be checked.
  * @param {string} eventName The event name.
  * @private
  */
	function isAbleToInteractWith_(node, eventName) {
		var currElement = node;
		var isAble = true;
		var matchesSelector = 'button, input, select, textarea, fieldset';

		if (eventName === 'click') {
			while (currElement) {
				if (currElement.disabled && match(currElement, matchesSelector)) {
					isAble = false;
					break;
				}

				currElement = currElement.parentNode;
			}
		}

		return isAble;
	}

	/**
  * Inserts node in document as last element.
  * @param {Element} node Element to remove children from.
  */
	function enterDocument(node) {
		node && append(document.body, node);
	}

	/**
  * Removes node from document.
  * @param {Element} node Element to remove children from.
  */
	function exitDocument(node) {
		if (node && node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
  * This is called when an event is triggered by a delegate listener. All
  * matching listeners of this event type from `target` to `currentTarget` will
  * be triggered.
  * @param {!Event} event The event payload.
  * @return {boolean} False if at least one of the triggered callbacks returns
  *     false, or true otherwise.
  * @private
  */
	function handleDelegateEvent_(event) {
		normalizeDelegateEvent_(event);
		var currElement = (0, _metal.isDef)(event[NEXT_TARGET]) ? event[NEXT_TARGET] : event.target;
		var ret = true;
		var container = event.currentTarget;
		var limit = event.currentTarget.parentNode;
		var defFns = [];

		while (currElement && currElement !== limit && !event.stopped) {
			event.delegateTarget = currElement;
			ret &= triggerMatchedListeners_(container, currElement, event, defFns);
			currElement = currElement.parentNode;
		}

		for (var i = 0; i < defFns.length && !event.defaultPrevented; i++) {
			event.delegateTarget = defFns[i].element;
			ret &= defFns[i].fn(event);
		}

		event.delegateTarget = null;
		event[NEXT_TARGET] = limit;
		return ret;
	}

	/**
  * Checks if the given element has the requested css class.
  * @param {!Element} element
  * @param {string} className
  * @return {boolean}
  */
	function hasClass(element, className) {
		if ('classList' in element) {
			return hasClassWithNative_(element, className);
		} else {
			return hasClassWithoutNative_(element, className);
		}
	}

	/**
  * Checks if the given element has the requested css class using classList.
  * @param {!Element} element
  * @param {string} className
  * @return {boolean}
  * @private
  */
	function hasClassWithNative_(element, className) {
		return element.classList.contains(className);
	}

	/**
  * Checks if the given element has the requested css class without using classList.
  * @param {!Element} element
  * @param {string} className
  * @return {boolean}
  * @private
  */
	function hasClassWithoutNative_(element, className) {
		return (' ' + element.className + ' ').indexOf(' ' + className + ' ') >= 0;
	}

	/**
  * Checks if the given element is empty or not.
  * @param {!Element} element
  * @return {boolean}
  */
	function isEmpty(element) {
		return element.childNodes.length === 0;
	}

	/**
  * Check if an element matches a given selector.
  * @param {Element} element
  * @param {string} selector
  * @return {boolean}
  */
	function match(element, selector) {
		if (!element || element.nodeType !== 1) {
			return false;
		}

		var p = Element.prototype;
		var m = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector;
		if (m) {
			return m.call(element, selector);
		}

		return matchFallback_(element, selector);
	}

	/**
  * Check if an element matches a given selector, using an internal implementation
  * instead of calling existing javascript functions.
  * @param {Element} element
  * @param {string} selector
  * @return {boolean}
  * @private
  */
	function matchFallback_(element, selector) {
		var nodes = document.querySelectorAll(selector, element.parentNode);
		for (var i = 0; i < nodes.length; ++i) {
			if (nodes[i] === element) {
				return true;
			}
		}
		return false;
	}

	/**
  * Returns the next sibling of the given element that matches the specified
  * selector, or null if there is none.
  * @param {!Element} element
  * @param {?string} selector
  */
	function next(element, selector) {
		do {
			element = element.nextSibling;
			if (element && match(element, selector)) {
				return element;
			}
		} while (element);
		return null;
	}

	/**
  * Normalizes the event payload for delegate listeners.
  * @param {!Event} event
  * @private
  */
	function normalizeDelegateEvent_(event) {
		event.stopPropagation = stopPropagation_;
		event.stopImmediatePropagation = stopImmediatePropagation_;
	}

	/**
  * Listens to the specified event on the given DOM element. This function normalizes
  * DOM event payloads and functions so they'll work the same way on all supported
  * browsers.
  * @param {!Element|string} element The DOM element to listen to the event on, or
  *   a selector that should be delegated on the entire document.
  * @param {string} eventName The name of the event to listen to.
  * @param {!function(!Object)} callback Function to be called when the event is
  *   triggered. It will receive the normalized event object.
  * @param {boolean} opt_capture Flag indicating if listener should be triggered
  *   during capture phase, instead of during the bubbling phase. Defaults to false.
  * @return {!DomEventHandle} Can be used to remove the listener.
  */
	function on(element, eventName, callback, opt_capture) {
		if ((0, _metal.isString)(element)) {
			return delegate(document, eventName, element, callback);
		}
		var customConfig = customEvents[eventName];
		if (customConfig && customConfig.event) {
			eventName = customConfig.originalEvent;
			callback = customConfig.handler.bind(customConfig, callback);
		}
		element.addEventListener(eventName, callback, opt_capture);
		return new _DomEventHandle2.default(element, eventName, callback, opt_capture);
	}

	/**
  * Listens to the specified event on the given DOM element once. This
  * function normalizes DOM event payloads and functions so they'll work the
  * same way on all supported browsers.
  * @param {!Element} element The DOM element to listen to the event on.
  * @param {string} eventName The name of the event to listen to.
  * @param {!function(!Object)} callback Function to be called when the event
  *   is triggered. It will receive the normalized event object.
  * @return {!DomEventHandle} Can be used to remove the listener.
  */
	function once(element, eventName, callback) {
		var domEventHandle = on(element, eventName, function () {
			domEventHandle.removeListener();
			return callback.apply(this, arguments);
		});
		return domEventHandle;
	}

	/**
  * Gets the first parent from the given element that matches the specified
  * selector, or null if none match.
  * @param {!Element} element
  * @param {string} selector
  * @return {Element}
  */
	function parent(element, selector) {
		return closest(element.parentNode, selector);
	}

	/**
  * Registers a custom event.
  * @param {string} eventName The name of the custom event.
  * @param {!Object} customConfig An object with information about how the event
  *   should be handled.
  */
	function registerCustomEvent(eventName, customConfig) {
		customEvents[eventName] = customConfig;
	}

	/**
  * Removes all the child nodes on a DOM node.
  * @param {Element} node Element to remove children from.
  */
	function removeChildren(node) {
		var child;
		while (child = node.firstChild) {
			node.removeChild(child);
		}
	}

	/**
  * Removes the requested CSS classes from an element.
  * @param {!Element|!NodeList} elements The element or elements to remove CSS classes from.
  * @param {string} classes CSS classes to remove.
  */
	function removeClasses(elements, classes) {
		if (!(0, _metal.isObject)(elements) || !(0, _metal.isString)(classes)) {
			return;
		}

		if (!elements.length) {
			elements = [elements];
		}

		for (var i = 0; i < elements.length; i++) {
			if ('classList' in elements[i]) {
				removeClassesWithNative_(elements[i], classes);
			} else {
				removeClassesWithoutNative_(elements[i], classes);
			}
		}
	}

	/**
  * Removes the requested CSS classes from an element using classList.
  * @param {!Element} element The element to remove CSS classes from.
  * @param {string} classes CSS classes to remove.
  * @private
  */
	function removeClassesWithNative_(element, classes) {
		classes.split(' ').forEach(function (className) {
			if (className) {
				element.classList.remove(className);
			}
		});
	}

	/**
  * Removes the requested CSS classes from an element without using classList.
  * @param {!Element} element The element to remove CSS classes from.
  * @param {string} classes CSS classes to remove.
  * @private
  */
	function removeClassesWithoutNative_(element, classes) {
		var elementClassName = ' ' + element.className + ' ';

		classes = classes.split(' ');

		for (var i = 0; i < classes.length; i++) {
			elementClassName = elementClassName.replace(' ' + classes[i] + ' ', ' ');
		}

		element.className = elementClassName.trim();
	}

	/**
  * Replaces the first element with the second.
  * @param {Element} element1
  * @param {Element} element2
  */
	function replace(element1, element2) {
		if (element1 && element2 && element1 !== element2 && element1.parentNode) {
			element1.parentNode.insertBefore(element2, element1);
			element1.parentNode.removeChild(element1);
		}
	}

	/**
  * The function that replaces `stopImmediatePropagation_` for events.
  * @private
  */
	function stopImmediatePropagation_() {
		var event = this; // jshint ignore:line
		event.stopped = true;
		event.stoppedImmediate = true;
		Event.prototype.stopImmediatePropagation.call(event);
	}

	/**
  * The function that replaces `stopPropagation` for events.
  * @private
  */
	function stopPropagation_() {
		var event = this; // jshint ignore:line
		event.stopped = true;
		Event.prototype.stopPropagation.call(event);
	}

	/**
  * Checks if the given element supports the given event type.
  * @param {!Element|string} element The DOM element or element tag name to check.
  * @param {string} eventName The name of the event to check.
  * @return {boolean}
  */
	function supportsEvent(element, eventName) {
		if (customEvents[eventName]) {
			return true;
		}

		if ((0, _metal.isString)(element)) {
			if (!elementsByTag_[element]) {
				elementsByTag_[element] = document.createElement(element);
			}
			element = elementsByTag_[element];
		}
		return 'on' + eventName in element;
	}

	/**
  * Converts the given argument to a DOM element. Strings are assumed to
  * be selectors, and so a matched element will be returned. If the arg
  * is already a DOM element it will be the return value.
  * @param {string|Element|Document} selectorOrElement
  * @return {Element} The converted element, or null if none was found.
  */
	function toElement(selectorOrElement) {
		if ((0, _metal.isElement)(selectorOrElement) || (0, _metal.isDocument)(selectorOrElement)) {
			return selectorOrElement;
		} else if ((0, _metal.isString)(selectorOrElement)) {
			if (selectorOrElement[0] === '#' && selectorOrElement.indexOf(' ') === -1) {
				return document.getElementById(selectorOrElement.substr(1));
			} else {
				return document.querySelector(selectorOrElement);
			}
		} else {
			return null;
		}
	}

	/**
  * Adds or removes one or more classes from an element. If any of the classes
  * is present, it will be removed from the element, or added otherwise.
  * @param {!Element} element The element which classes will be toggled.
  * @param {string} classes The classes which have to added or removed from the element.
  */
	function toggleClasses(element, classes) {
		if (!(0, _metal.isObject)(element) || !(0, _metal.isString)(classes)) {
			return;
		}

		if ('classList' in element) {
			toggleClassesWithNative_(element, classes);
		} else {
			toggleClassesWithoutNative_(element, classes);
		}
	}

	/**
  * Adds or removes one or more classes from an element using classList.
  * If any of the classes is present, it will be removed from the element,
  * or added otherwise.
  * @param {!Element} element The element which classes will be toggled.
  * @param {string} classes The classes which have to added or removed from the element.
  * @private
  */
	function toggleClassesWithNative_(element, classes) {
		classes.split(' ').forEach(function (className) {
			element.classList.toggle(className);
		});
	}

	/**
  * Adds or removes one or more classes from an element without using classList.
  * If any of the classes is present, it will be removed from the element,
  * or added otherwise.
  * @param {!Element} element The element which classes will be toggled.
  * @param {string} classes The classes which have to added or removed from the element.
  * @private
  */
	function toggleClassesWithoutNative_(element, classes) {
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
	}

	/**
  * Triggers the specified event on the given element.
  * NOTE: This should mostly be used for testing, not on real code.
  * @param {!Element} element The node that should trigger the event.
  * @param {string} eventName The name of the event to be triggred.
  * @param {Object=} opt_eventObj An object with data that should be on the
  *   triggered event's payload.
  */
	function triggerEvent(element, eventName, opt_eventObj) {
		if (isAbleToInteractWith_(element, eventName)) {
			var eventObj = document.createEvent('HTMLEvents');
			eventObj.initEvent(eventName, true, true);
			_metal.object.mixin(eventObj, opt_eventObj);
			element.dispatchEvent(eventObj);
		}
	}

	/**
  * Triggers the given listeners array.
  * @param {Array<!function()>} listeners
  * @param {!Event} event
  * @param {!Element} element
  * @param {!Array} defaultFns Array to collect default listeners in, instead
  *     of running them.
  * @return {boolean} False if at least one of the triggered callbacks returns
  *     false, or true otherwise.
  * @private
  */
	function triggerListeners_(listeners, event, element, defaultFns) {
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
	}

	/**
  * Triggers all listeners for the given event type that are stored in the
  * specified element.
  * @param {!Element} container
  * @param {!Element} element
  * @param {!Event} event
  * @param {!Array} defaultFns Array to collect default listeners in, instead
  *     of running them.
  * @return {boolean} False if at least one of the triggered callbacks returns
  *     false, or true otherwise.
  * @private
  */
	function triggerMatchedListeners_(container, element, event, defaultFns) {
		if (event.type === 'click' && event.button === 2) {
			// Firefox triggers "click" events on the document for right clicks. This
			// causes our delegate logic to trigger it for regular elements too, which
			// shouldn't happen. Ignoring them here.
			return;
		}

		var data = _domData2.default.get(element);
		var listeners = data.listeners[event.type];
		var ret = triggerListeners_(listeners, event, element, defaultFns);

		var selectorsMap = _domData2.default.get(container).delegating[event.type].selectors;
		var selectors = Object.keys(selectorsMap);
		for (var i = 0; i < selectors.length && !event.stoppedImmediate; i++) {
			if (match(element, selectors[i])) {
				listeners = selectorsMap[selectors[i]];
				ret &= triggerListeners_(listeners, event, element, defaultFns);
			}
		}

		return ret;
	}
});
//# sourceMappingURL=dom.js.map