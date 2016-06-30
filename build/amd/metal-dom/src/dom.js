define(['exports', 'metal/src/metal', './DomEventHandle'], function (exports, _metal, _DomEventHandle) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

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

		dom.delegate = function delegate(element, eventName, selector, callback) {
			var customConfig = dom.customEvents[eventName];
			if (customConfig && customConfig.delegate) {
				eventName = customConfig.originalEvent;
				callback = customConfig.handler.bind(customConfig, callback);
			}
			return dom.on(element, eventName, dom.handleDelegateEvent_.bind(null, selector, callback));
		};

		dom.enterDocument = function enterDocument(node) {
			node && dom.append(document.body, node);
		};

		dom.exitDocument = function exitDocument(node) {
			if (node && node.parentNode) {
				node.parentNode.removeChild(node);
			}
		};

		dom.handleDelegateEvent_ = function handleDelegateEvent_(selector, callback, event) {
			dom.normalizeDelegateEvent_(event);

			var currentElement = event.target;
			var returnValue = true;

			while (currentElement && !event.stopped) {
				if (_metal.core.isString(selector) && dom.match(currentElement, selector)) {
					event.delegateTarget = currentElement;
					returnValue &= callback(event);
				}
				if (currentElement === event.currentTarget) {
					break;
				}
				currentElement = currentElement.parentNode;
			}
			event.delegateTarget = null;

			return returnValue;
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

		return dom;
	}();

	var elementsByTag = {};
	dom.customEvents = {};

	exports.default = dom;
});
//# sourceMappingURL=dom.js.map