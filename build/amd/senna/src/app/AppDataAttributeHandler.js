var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

		return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
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

		function AppDataAttributeHandler() {
			_classCallCheck(this, AppDataAttributeHandler);

			var _this = _possibleConstructorReturn(this, _Disposable.call(this));

			_this.app = null;
			_this.baseElement = null;
			return _this;
		}

		AppDataAttributeHandler.prototype.handle = function handle() {
			if (!_metal.core.isElement(this.baseElement)) {
				throw new Error('Senna data attribute handler base element ' + 'not set or invalid, try setting a valid element that ' + 'contains a `data-senna` attribute.');
			}

			if (!this.baseElement.hasAttribute(_dataAttributes2.default.senna)) {
				console.log('Senna was not initialized from data attributes. ' + 'In order to enable its usage from data attributes try setting ' + 'in the base element, e.g. `<body data-senna>`.');
				return;
			}

			if (this.app) {
				throw new Error('Senna app was already initialized.');
			}

			console.log('Senna initialized from data attribute.');
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
				console.log('Senna can\'t find route elements, adding default.');
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
			console.log('Senna scanned route ' + route.getPath());
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
				console.log('Senna scanned base path ' + basePath);
			}
		};

		AppDataAttributeHandler.prototype.maybeSetLinkSelector_ = function maybeSetLinkSelector_() {
			var linkSelector = this.baseElement.getAttribute(_dataAttributes2.default.linkSelector);

			if (_metal.core.isDefAndNotNull(linkSelector)) {
				this.app.setLinkSelector(linkSelector);
				console.log('Senna scanned link selector ' + linkSelector);
			}
		};

		AppDataAttributeHandler.prototype.maybeSetLoadingCssClass_ = function maybeSetLoadingCssClass_() {
			var loadingCssClass = this.baseElement.getAttribute(_dataAttributes2.default.loadingCssClass);

			if (_metal.core.isDefAndNotNull(loadingCssClass)) {
				this.app.setLoadingCssClass(loadingCssClass);
				console.log('Senna scanned loading css class ' + loadingCssClass);
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

				console.log('Senna scanned update scroll position ' + updateScrollPosition);
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

	AppDataAttributeHandler.prototype.registerMetalComponent && AppDataAttributeHandler.prototype.registerMetalComponent(AppDataAttributeHandler, 'AppDataAttributeHandler')
	exports.default = AppDataAttributeHandler;
});
//# sourceMappingURL=AppDataAttributeHandler.js.map