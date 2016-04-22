define(['exports', 'metal/src/metal', './dataAttributes', '../globals/globals', './App', '../screen/HtmlScreen', '../route/Route'], function (exports, _metal, _dataAttributes, _globals, _App, _HtmlScreen, _Route) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _dataAttributes2 = _interopRequireDefault(_dataAttributes);

	var _globals2 = _interopRequireDefault(_globals);

	var _App2 = _interopRequireDefault(_App);

	var _HtmlScreen2 = _interopRequireDefault(_HtmlScreen);

	var _Route2 = _interopRequireDefault(_Route);

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

	var AppDataAttributeHandler = function (_Disposable) {
		_inherits(AppDataAttributeHandler, _Disposable);

		/**
   * Initilizes App, register surfaces and routes from data attributes.
   * @constructor
   */

		function AppDataAttributeHandler() {
			_classCallCheck(this, AppDataAttributeHandler);

			var _this = _possibleConstructorReturn(this, _Disposable.call(this));

			/**
    * Holds the app reference initialized by data attributes.
    * @type {App}
    * @default null
    */
			_this.app = null;

			/**
    * Holds the base element to search initialization data attributes. This
    * element is the container used to enable initialization based on the
    * presence of `data-senna` attribute.
    * @type {Element}
    * @default null
    */
			_this.baseElement = null;
			return _this;
		}

		/**
   * Inits application based on information scanned from document.
   */


		AppDataAttributeHandler.prototype.handle = function handle() {
			if (!_metal.core.isElement(this.baseElement)) {
				throw new Error('Senna data attribute handler base element ' + 'not set or invalid, try setting a valid element that ' + 'contains a `data-senna` attribute.');
			}

			if (!this.baseElement.hasAttribute(_dataAttributes2.default.senna)) {
				void 0;
				return;
			}

			if (this.app) {
				throw new Error('Senna app was already initialized.');
			}

			void 0;

			this.app = new _App2.default();
			this.maybeAddRoutes_();
			this.maybeAddSurfaces_();
			this.maybeSetBasePath_();
			this.maybeSetLinkSelector_();
			this.maybeSetLoadingCssClass_();
			this.maybeSetUpdateScrollPosition_();
			this.maybeDispatch_();
		};

		AppDataAttributeHandler.prototype.disposeInternal = function disposeInternal() {
			if (this.app) {
				this.app.dispose();
			}
		};

		AppDataAttributeHandler.prototype.getApp = function getApp() {
			return this.app;
		};

		AppDataAttributeHandler.prototype.getBaseElement = function getBaseElement() {
			return this.baseElement;
		};

		AppDataAttributeHandler.prototype.maybeAddRoutes_ = function maybeAddRoutes_() {
			var _this2 = this;

			var routesSelector = 'link[rel="senna-route"]';
			this.querySelectorAllAsArray_(routesSelector).forEach(function (link) {
				return _this2.maybeParseLinkRoute_(link);
			});
			if (!this.app.hasRoutes()) {
				this.app.addRoutes(new _Route2.default(/.*/, _HtmlScreen2.default));
				void 0;
			}
		};

		AppDataAttributeHandler.prototype.maybeAddSurfaces_ = function maybeAddSurfaces_() {
			var _this3 = this;

			var surfacesSelector = '[' + _dataAttributes2.default.surface + ']';
			this.querySelectorAllAsArray_(surfacesSelector).forEach(function (surfaceElement) {
				_this3.updateElementIdIfSpecialSurface_(surfaceElement);
				_this3.app.addSurfaces(surfaceElement.id);
			});
		};

		AppDataAttributeHandler.prototype.maybeDispatch_ = function maybeDispatch_() {
			if (this.baseElement.hasAttribute(_dataAttributes2.default.dispatch)) {
				this.app.dispatch();
			}
		};

		AppDataAttributeHandler.prototype.maybeParseLinkRoute_ = function maybeParseLinkRoute_(link) {
			var route = new _Route2.default(this.maybeParseLinkRoutePath_(link), this.maybeParseLinkRouteHandler_(link));
			this.app.addRoutes(route);
			void 0;
		};

		AppDataAttributeHandler.prototype.maybeParseLinkRouteHandler_ = function maybeParseLinkRouteHandler_(link) {
			var handler = link.getAttribute('type');
			if (_metal.core.isDefAndNotNull(handler)) {
				handler = _metal.object.getObjectByName(handler);
			}
			return handler;
		};

		AppDataAttributeHandler.prototype.maybeParseLinkRoutePath_ = function maybeParseLinkRoutePath_(link) {
			var path = link.getAttribute('href');
			if (_metal.core.isDefAndNotNull(path)) {
				if (path.indexOf('regex:') === 0) {
					path = new RegExp(path.substring(6));
				}
			}
			return path;
		};

		AppDataAttributeHandler.prototype.maybeSetBasePath_ = function maybeSetBasePath_() {
			var basePath = this.baseElement.getAttribute(_dataAttributes2.default.basePath);
			if (_metal.core.isDefAndNotNull(basePath)) {
				this.app.setBasePath(basePath);
				void 0;
			}
		};

		AppDataAttributeHandler.prototype.maybeSetLinkSelector_ = function maybeSetLinkSelector_() {
			var linkSelector = this.baseElement.getAttribute(_dataAttributes2.default.linkSelector);
			if (_metal.core.isDefAndNotNull(linkSelector)) {
				this.app.setLinkSelector(linkSelector);
				void 0;
			}
		};

		AppDataAttributeHandler.prototype.maybeSetLoadingCssClass_ = function maybeSetLoadingCssClass_() {
			var loadingCssClass = this.baseElement.getAttribute(_dataAttributes2.default.loadingCssClass);
			if (_metal.core.isDefAndNotNull(loadingCssClass)) {
				this.app.setLoadingCssClass(loadingCssClass);
				void 0;
			}
		};

		AppDataAttributeHandler.prototype.maybeSetUpdateScrollPosition_ = function maybeSetUpdateScrollPosition_() {
			var updateScrollPosition = this.baseElement.getAttribute(_dataAttributes2.default.updateScrollPosition);
			if (_metal.core.isDefAndNotNull(updateScrollPosition)) {
				if (updateScrollPosition === 'false') {
					this.app.setUpdateScrollPosition(false);
				} else {
					this.app.setUpdateScrollPosition(true);
				}
				void 0;
			}
		};

		AppDataAttributeHandler.prototype.querySelectorAllAsArray_ = function querySelectorAllAsArray_(selector) {
			return Array.prototype.slice.call(_globals2.default.document.querySelectorAll(selector));
		};

		AppDataAttributeHandler.prototype.updateElementIdIfSpecialSurface_ = function updateElementIdIfSpecialSurface_(element) {
			if (!element.id && element === _globals2.default.document.body) {
				element.id = 'senna_surface_' + _metal.core.getUid();
			}
		};

		AppDataAttributeHandler.prototype.setBaseElement = function setBaseElement(baseElement) {
			this.baseElement = baseElement;
		};

		return AppDataAttributeHandler;
	}(_metal.Disposable);

	exports.default = AppDataAttributeHandler;
});
//# sourceMappingURL=AppDataAttributeHandler.js.map