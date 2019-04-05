define(['exports', 'metal/src/metal', 'metal-dom/src/all/dom', 'metal-promise/src/promise/Promise', '../globals/globals', './RequestScreen', '../surface/Surface', 'metal-useragent/src/UA', 'metal-uri/src/Uri', '../utils/utils'], function (exports, _metal, _dom, _Promise, _globals, _RequestScreen2, _Surface, _UA, _Uri, _utils) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Promise2 = _interopRequireDefault(_Promise);

	var _globals2 = _interopRequireDefault(_globals);

	var _RequestScreen3 = _interopRequireDefault(_RequestScreen2);

	var _Surface2 = _interopRequireDefault(_Surface);

	var _UA2 = _interopRequireDefault(_UA);

	var _Uri2 = _interopRequireDefault(_Uri);

	var _utils2 = _interopRequireDefault(_utils);

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

	var HtmlScreen = function (_RequestScreen) {
		_inherits(HtmlScreen, _RequestScreen);

		/**
   * Screen class that perform a request and extracts surface contents from
   * the response content.
   * @constructor
   * @extends {RequestScreen}
   */
		function HtmlScreen() {
			_classCallCheck(this, HtmlScreen);

			var _this = _possibleConstructorReturn(this, (HtmlScreen.__proto__ || Object.getPrototypeOf(HtmlScreen)).call(this));

			/**
    * Holds the meta selector. Relevant to extract <code>meta</code> tags
    * elements from request fragments to use as the screen.
    * @type {!string}
    * @default meta
    * @protected
    */
			_this.metaTagsSelector = 'meta';

			/**
    * Holds the title selector. Relevant to extract the <code><title></code>
    * element from request fragments to use as the screen title.
    * @type {!string}
    * @default title
    * @protected
    */
			_this.titleSelector = 'title';
			return _this;
		}

		/**
   * @inheritDoc
   */


		_createClass(HtmlScreen, [{
			key: 'activate',
			value: function activate() {
				_get(HtmlScreen.prototype.__proto__ || Object.getPrototypeOf(HtmlScreen.prototype), 'activate', this).call(this);
				this.releaseVirtualDocument();
				this.pendingStyles = null;
			}
		}, {
			key: 'allocateVirtualDocumentForContent',
			value: function allocateVirtualDocumentForContent(htmlString) {
				if (!this.virtualDocument) {
					this.virtualDocument = _globals2.default.document.createElement('html');
				}

				this.copyNodeAttributesFromContent_(htmlString, this.virtualDocument);

				this.virtualDocument.innerHTML = htmlString;
			}
		}, {
			key: 'appendStyleIntoDocument_',
			value: function appendStyleIntoDocument_(newStyle) {
				var isTemporaryStyle = (0, _dom.match)(newStyle, HtmlScreen.selectors.stylesTemporary);
				if (isTemporaryStyle) {
					this.pendingStyles.push(newStyle);
				}
				if (newStyle.id) {
					var styleInDoc = _globals2.default.document.getElementById(newStyle.id);
					if (styleInDoc) {
						styleInDoc.parentNode.insertBefore(newStyle, styleInDoc.nextSibling);
						return;
					}
				}
				_globals2.default.document.head.appendChild(newStyle);
			}
		}, {
			key: 'assertSameBodyIdInVirtualDocument',
			value: function assertSameBodyIdInVirtualDocument() {
				var bodySurface = this.virtualDocument.querySelector('body');
				if (!_globals2.default.document.body.id) {
					_globals2.default.document.body.id = 'senna_surface_' + (0, _metal.getUid)();
				}
				if (bodySurface) {
					bodySurface.id = _globals2.default.document.body.id;
				}
			}
		}, {
			key: 'copyNodeAttributesFromContent_',
			value: function copyNodeAttributesFromContent_(content, node) {
				content = content.replace(/[<]\s*html/ig, '<senna');
				content = content.replace(/\/html\s*\>/ig, '/senna>');
				var placeholder = void 0;
				if (_UA2.default.isIe) {
					var tempNode = _globals2.default.document.createRange().createContextualFragment(content);
					placeholder = tempNode.querySelector('senna');
				} else {
					node.innerHTML = content;
					placeholder = node.querySelector('senna');
				}

				if (placeholder) {
					_utils2.default.clearNodeAttributes(node);
					_utils2.default.copyNodeAttributes(placeholder, node);
				}
			}
		}, {
			key: 'disposeInternal',
			value: function disposeInternal() {
				this.disposePendingStyles();
				_get(HtmlScreen.prototype.__proto__ || Object.getPrototypeOf(HtmlScreen.prototype), 'disposeInternal', this).call(this);
			}
		}, {
			key: 'disposePendingStyles',
			value: function disposePendingStyles() {
				if (this.pendingStyles) {
					_utils2.default.removeElementsFromDocument(this.pendingStyles);
				}
			}
		}, {
			key: 'evaluateScripts',
			value: function evaluateScripts(surfaces) {
				var _this2 = this;

				var evaluateTrackedScripts = this.evaluateTrackedResources_(_dom.globalEval.runScriptsInElement, HtmlScreen.selectors.scripts, HtmlScreen.selectors.scriptsTemporary, HtmlScreen.selectors.scriptsPermanent);

				return evaluateTrackedScripts.then(function () {
					return _get(HtmlScreen.prototype.__proto__ || Object.getPrototypeOf(HtmlScreen.prototype), 'evaluateScripts', _this2).call(_this2, surfaces);
				});
			}
		}, {
			key: 'evaluateStyles',
			value: function evaluateStyles(surfaces) {
				var _this3 = this;

				this.pendingStyles = [];
				var evaluateTrackedStyles = this.evaluateTrackedResources_(_dom.globalEvalStyles.runStylesInElement, HtmlScreen.selectors.styles, HtmlScreen.selectors.stylesTemporary, HtmlScreen.selectors.stylesPermanent, this.appendStyleIntoDocument_.bind(this));

				return evaluateTrackedStyles.then(function () {
					return _get(HtmlScreen.prototype.__proto__ || Object.getPrototypeOf(HtmlScreen.prototype), 'evaluateStyles', _this3).call(_this3, surfaces);
				});
			}
		}, {
			key: 'evaluateFavicon_',
			value: function evaluateFavicon_() {
				var _this4 = this;

				var resourcesInVirtual = this.virtualQuerySelectorAll_(HtmlScreen.selectors.favicon);
				var resourcesInDocument = this.querySelectorAll_(HtmlScreen.selectors.favicon);

				return new _Promise2.default(function (resolve) {
					_utils2.default.removeElementsFromDocument(resourcesInDocument);
					_this4.runFaviconInElement_(resourcesInVirtual).then(function () {
						return resolve();
					});
				});
			}
		}, {
			key: 'evaluateTrackedResources_',
			value: function evaluateTrackedResources_(evaluatorFn, selector, selectorTemporary, selectorPermanent, opt_appendResourceFn) {
				var _this5 = this;

				var tracked = this.virtualQuerySelectorAll_(selector);
				var temporariesInDoc = this.querySelectorAll_(selectorTemporary);
				var permanentsInDoc = this.querySelectorAll_(selectorPermanent);

				// Adds permanent resources in document to cache.
				permanentsInDoc.forEach(function (resource) {
					var resourceKey = _this5.getResourceKey_(resource);
					if (resourceKey) {
						HtmlScreen.permanentResourcesInDoc[resourceKey] = true;
					}
				});

				var frag = (0, _dom.buildFragment)();
				tracked.forEach(function (resource) {
					var resourceKey = _this5.getResourceKey_(resource);
					// Do not load permanent resources if already in document.
					if (!HtmlScreen.permanentResourcesInDoc[resourceKey]) {
						frag.appendChild(resource);
					}
					// If resource has key and is permanent add to cache.
					if (resourceKey && (0, _dom.match)(resource, selectorPermanent)) {
						HtmlScreen.permanentResourcesInDoc[resourceKey] = true;
					}
				});

				return new _Promise2.default(function (resolve) {
					evaluatorFn(frag, function () {
						_utils2.default.removeElementsFromDocument(temporariesInDoc);
						resolve();
					}, opt_appendResourceFn);
				});
			}
		}, {
			key: 'flip',
			value: function flip(surfaces) {
				var _this6 = this;

				return _get(HtmlScreen.prototype.__proto__ || Object.getPrototypeOf(HtmlScreen.prototype), 'flip', this).call(this, surfaces).then(function () {
					_utils2.default.clearNodeAttributes(_globals2.default.document.documentElement);
					_utils2.default.copyNodeAttributes(_this6.virtualDocument, _globals2.default.document.documentElement);
					_this6.evaluateFavicon_();
					_this6.updateMetaTags_();
				});
			}
		}, {
			key: 'updateMetaTags_',
			value: function updateMetaTags_() {
				var currentMetaNodes = this.querySelectorAll_('meta');
				var metasFromVirtualDocument = this.metas;
				if (currentMetaNodes) {
					_utils2.default.removeElementsFromDocument(currentMetaNodes);
					if (metasFromVirtualDocument) {
						metasFromVirtualDocument.forEach(function (meta) {
							return _globals2.default.document.head.appendChild(meta);
						});
					}
				}
			}
		}, {
			key: 'getResourceKey_',
			value: function getResourceKey_(resource) {
				return resource.id || resource.href || resource.src || '';
			}
		}, {
			key: 'getSurfaceContent',
			value: function getSurfaceContent(surfaceId) {
				var surface = this.virtualDocument.querySelector('#' + surfaceId);
				if (surface) {
					var defaultChild = surface.querySelector('#' + surfaceId + '-' + _Surface2.default.DEFAULT);
					if (defaultChild) {
						return defaultChild.innerHTML;
					}
					return surface.innerHTML; // If default content not found, use surface content
				}
			}
		}, {
			key: 'getTitleSelector',
			value: function getTitleSelector() {
				return this.titleSelector;
			}
		}, {
			key: 'load',
			value: function load(path) {
				var _this7 = this;

				return _get(HtmlScreen.prototype.__proto__ || Object.getPrototypeOf(HtmlScreen.prototype), 'load', this).call(this, path).then(function (content) {
					_this7.allocateVirtualDocumentForContent(content);
					_this7.resolveTitleFromVirtualDocument();
					_this7.resolveMetaTagsFromVirtualDocument();
					_this7.assertSameBodyIdInVirtualDocument();
					if (_UA2.default.isIe) {
						_this7.makeTemporaryStylesHrefsUnique_();
					}
					return content;
				});
			}
		}, {
			key: 'makeTemporaryStylesHrefsUnique_',
			value: function makeTemporaryStylesHrefsUnique_() {
				var _this8 = this;

				var temporariesInDoc = this.virtualQuerySelectorAll_(HtmlScreen.selectors.stylesTemporary);
				temporariesInDoc.forEach(function (style) {
					return _this8.replaceStyleAndMakeUnique_(style);
				});
			}
		}, {
			key: 'replaceStyleAndMakeUnique_',
			value: function replaceStyleAndMakeUnique_(style) {
				if (style.href) {
					var newStyle = _globals2.default.document.createElement(style.tagName);
					style.href = new _Uri2.default(style.href).makeUnique().toString();
					_utils2.default.copyNodeAttributes(style, newStyle);
					style.parentNode.replaceChild(newStyle, style);
					style.disabled = true;
				}
			}
		}, {
			key: 'runFaviconInElement_',
			value: function runFaviconInElement_(elements) {
				return new _Promise2.default(function (resolve) {
					elements.forEach(function (element) {
						return document.head.appendChild(_UA2.default.isIe ? element : _utils2.default.setElementWithRandomHref(element));
					});
					resolve();
				});
			}
		}, {
			key: 'virtualQuerySelectorAll_',
			value: function virtualQuerySelectorAll_(selector) {
				return Array.prototype.slice.call(this.virtualDocument.querySelectorAll(selector));
			}
		}, {
			key: 'querySelectorAll_',
			value: function querySelectorAll_(selector) {
				return Array.prototype.slice.call(_globals2.default.document.querySelectorAll(selector));
			}
		}, {
			key: 'releaseVirtualDocument',
			value: function releaseVirtualDocument() {
				this.virtualDocument = null;
			}
		}, {
			key: 'resolveTitleFromVirtualDocument',
			value: function resolveTitleFromVirtualDocument() {
				var title = this.virtualDocument.querySelector(this.titleSelector);
				if (title) {
					this.setTitle(title.textContent.trim());
				}
			}
		}, {
			key: 'resolveMetaTagsFromVirtualDocument',
			value: function resolveMetaTagsFromVirtualDocument() {
				var metas = this.virtualQuerySelectorAll_(this.metaTagsSelector);
				if (metas) {
					this.setMetas(metas);
				}
			}
		}, {
			key: 'setTitleSelector',
			value: function setTitleSelector(titleSelector) {
				this.titleSelector = titleSelector;
			}
		}]);

		return HtmlScreen;
	}(_RequestScreen3.default);

	/**
  * Helper selector for ignore favicon when exist data-senna-track.
  */
	var ignoreFavicon = ':not([rel="Shortcut Icon"]):not([rel="shortcut icon"]):not([rel="icon"]):not([href$="favicon.icon"])';

	/**
  * Helper selectors for tracking resources.
  * @type {object}
  * @protected
  * @static
  */
	HtmlScreen.selectors = {
		favicon: 'link[rel="Shortcut Icon"],link[rel="shortcut icon"],link[rel="icon"],link[href$="favicon.icon"]',
		scripts: 'script[data-senna-track]',
		scriptsPermanent: 'script[data-senna-track="permanent"]',
		scriptsTemporary: 'script[data-senna-track="temporary"]',
		styles: 'style[data-senna-track],link[data-senna-track]' + ignoreFavicon,
		stylesPermanent: 'style[data-senna-track="permanent"],link[data-senna-track="permanent"]' + ignoreFavicon,
		stylesTemporary: 'style[data-senna-track="temporary"],link[data-senna-track="temporary"]' + ignoreFavicon
	};

	/**
  * Caches permanent resource keys.
  * @type {object}
  * @protected
  * @static
  */
	HtmlScreen.permanentResourcesInDoc = {};

	exports.default = HtmlScreen;
});
//# sourceMappingURL=HtmlScreen.js.map
