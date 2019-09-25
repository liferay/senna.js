define(['exports', 'metal-dom/src/all/dom', 'metal/src/metal', 'metal-events/src/events', 'metal-promise/src/promise/Promise', 'metal-debounce/src/debounce', '../globals/globals', '../route/Route', '../screen/Screen', '../surface/Surface', 'metal-uri/src/Uri', '../utils/utils'], function (exports, _dom, _metal, _events, _Promise, _debounce, _globals, _Route, _Screen, _Surface, _Uri, _utils) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Promise2 = _interopRequireDefault(_Promise);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _globals2 = _interopRequireDefault(_globals);

	var _Route2 = _interopRequireDefault(_Route);

	var _Screen2 = _interopRequireDefault(_Screen);

	var _Surface2 = _interopRequireDefault(_Surface);

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

	var NavigationStrategy = {
		IMMEDIATE: 'immediate',
		SCHEDULE_LAST: 'scheduleLast'
	};

	var App = function (_EventEmitter) {
		_inherits(App, _EventEmitter);

		/**
   * App class that handle routes and screens lifecycle.
   * @constructor
   * @extends {EventEmitter}
   */
		function App() {
			_classCallCheck(this, App);

			var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

			/**
    * Holds the active screen.
    * @type {?Screen}
    * @protected
    */
			_this.activeScreen = null;

			/**
    * Holds the active path containing the query parameters.
    * @type {?string}
    * @protected
    */
			_this.activePath = null;

			/**
    * Allows prevent navigate from dom prevented event.
    * @type {boolean}
    * @default true
    * @protected
    */
			_this.allowPreventNavigate = true;

			/**
    * Holds link base path.
    * @type {!string}
    * @default ''
    * @protected
    */
			_this.basePath = '';

			/**
    * Holds the value of the browser path before a navigation is performed.
    * @type {!string}
    * @default the current browser path.
    * @protected
    */
			_this.browserPathBeforeNavigate = _utils2.default.getCurrentBrowserPathWithoutHash();

			/**
    * Captures scroll position from scroll event.
    * @type {!boolean}
    * @default true
    * @protected
    */
			_this.captureScrollPositionFromScrollEvent = true;

			/**
    * Holds the default page title.
    * @type {string}
    * @default null
    * @protected
    */
			_this.defaultTitle = _globals2.default.document.title;

			/**
    * Holds the form selector to define forms that are routed.
    * @type {!string}
    * @default form[enctype="multipart/form-data"]:not([data-senna-off])
    * @protected
    */
			_this.formSelector = 'form[enctype="multipart/form-data"]:not([data-senna-off])';

			/**
    * When enabled, the route matching ignores query string from the path.
    * @type {boolean}
    * @default false
    * @protected
    */
			_this.ignoreQueryStringFromRoutePath = false;

			/**
    * Holds the link selector to define links that are routed.
    * @type {!string}
    * @default a:not([data-senna-off])
    * @protected
    */
			_this.linkSelector = 'a:not([data-senna-off]):not([target="_blank"])';

			/**
    * Holds the loading css class.
    * @type {!string}
    * @default senna-loading
    * @protected
    */
			_this.loadingCssClass = 'senna-loading';

			/**
    * Using the History API to manage your URLs is awesome and, as it happens,
    * a crucial feature of good web apps. One of its downsides, however, is
    * that scroll positions are stored and then, more importantly, restored
    * whenever you traverse the history. This often means unsightly jumps as
    * the scroll position changes automatically, and especially so if your app
    * does transitions, or changes the contents of the page in any way.
    * Ultimately this leads to an horrible user experience. The good news is,
    * however, that there’s a potential fix: history.scrollRestoration.
    * https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
    * @type {boolean}
    * @protected
    */
			_this.nativeScrollRestorationSupported = 'scrollRestoration' in _globals2.default.window.history;

			/**
    * When set to NavigationStrategy.SCHEDULE_LAST means that the current navigation
    * cannot be Cancelled to start another and will be queued in
    * scheduledNavigationQueue. When NavigationStrategy.IMMEDIATE means that all
    * navigation will be cancelled to start another.
    * @type {!string}
    * @default immediate
    * @protected
    */
			_this.navigationStrategy = NavigationStrategy.IMMEDIATE;

			/**
    * When set to true there is a pendingNavigate that has not yet been
    * resolved or rejected.
    * @type {boolean}
    * @default false
    * @protected
    */
			_this.isNavigationPending = false;

			/**
    * Holds a deferred with the current navigation.
    * @type {?CancellablePromise}
    * @default null
    * @protected
    */
			_this.pendingNavigate = null;

			/**
    * Holds the window horizontal scroll position when the navigation using
    * back or forward happens to be restored after the surfaces are updated.
    * @type {!Number}
    * @default 0
    * @protected
    */
			_this.popstateScrollLeft = 0;

			/**
    * Holds the window vertical scroll position when the navigation using
    * back or forward happens to be restored after the surfaces are updated.
    * @type {!Number}
    * @default 0
    * @protected
    */
			_this.popstateScrollTop = 0;

			/**
    * Holds the redirect path containing the query parameters.
    * @type {?string}
    * @protected
    */
			_this.redirectPath = null;

			/**
    * Holds the screen routes configuration.
    * @type {?Array}
    * @default []
    * @protected
    */
			_this.routes = [];

			/**
    * Holds a queue that stores every DOM event that can initiate a navigation.
    * @type {!Event}
    * @default []
    * @protected
    */
			_this.scheduledNavigationQueue = [];

			/**
    * Maps the screen instances by the url containing the parameters.
    * @type {?Object}
    * @default {}
    * @protected
    */
			_this.screens = {};

			/**
    * When set to true the first erroneous popstate fired on page load will be
    * ignored, only if <code>globals.window.history.state</code> is also
    * <code>null</code>.
    * @type {boolean}
    * @default false
    * @protected
    */
			_this.skipLoadPopstate = false;

			/**
    * Maps that index the surfaces instances by the surface id.
    * @type {?Object}
    * @default {}
    * @protected
    */
			_this.surfaces = {};

			/**
    * When set to true, moves the scroll position after popstate, or to the
    * top of the viewport for new navigation. If false, the browser will
    * take care of scroll restoration.
    * @type {!boolean}
    * @default true
    * @protected
    */
			_this.updateScrollPosition = true;

			_this.appEventHandlers_ = new _events.EventHandler();

			_this.appEventHandlers_.add((0, _dom.on)(_globals2.default.window, 'scroll', (0, _debounce2.default)(_this.onScroll_.bind(_this), 100)), (0, _dom.on)(_globals2.default.window, 'load', _this.onLoad_.bind(_this)), (0, _dom.on)(_globals2.default.window, 'popstate', _this.onPopstate_.bind(_this)));

			_this.on('startNavigate', _this.onStartNavigate_);
			_this.on('beforeNavigate', _this.onBeforeNavigate_);
			_this.on('beforeNavigate', _this.onBeforeNavigateDefault_, true);
			_this.on('beforeUnload', _this.onBeforeUnloadDefault_);

			_this.setLinkSelector(_this.linkSelector);
			_this.setFormSelector(_this.formSelector);

			_this.maybeOverloadBeforeUnload_();
			return _this;
		}

		/**
   * Adds one or more screens to the application.
   *
   * Example:
   *
   * <code>
   *   app.addRoutes({ path: '/foo', handler: FooScreen });
   *   or
   *   app.addRoutes([{ path: '/foo', handler: function(route) { return new FooScreen(); } }]);
   * </code>
   *
   * @param {Object} or {Array} routes Single object or an array of object.
   *     Each object should contain <code>path</code> and <code>screen</code>.
   *     The <code>path</code> should be a string or a regex that maps the
   *     navigation route to a screen class definition (not an instance), e.g:
   *         <code>{ path: "/home:param1", handler: MyScreen }</code>
   *         <code>{ path: /foo.+/, handler: MyScreen }</code>
   * @chainable
   */


		_createClass(App, [{
			key: 'addRoutes',
			value: function addRoutes(routes) {
				var _this2 = this;

				if (!Array.isArray(routes)) {
					routes = [routes];
				}
				routes.forEach(function (route) {
					if (!(route instanceof _Route2.default)) {
						route = new _Route2.default(route.path, route.handler);
					}
					_this2.routes.push(route);
				});
				return this;
			}
		}, {
			key: 'addSurfaces',
			value: function addSurfaces(surfaces) {
				var _this3 = this;

				if (!Array.isArray(surfaces)) {
					surfaces = [surfaces];
				}
				surfaces.forEach(function (surface) {
					if ((0, _metal.isString)(surface)) {
						surface = new _Surface2.default(surface);
					}
					_this3.surfaces[surface.getId()] = surface;
				});
				return this;
			}
		}, {
			key: 'canNavigate',
			value: function canNavigate(url) {
				var uri = _utils2.default.isWebUri(url);

				if (!uri) {
					return false;
				}

				var path = _utils2.default.getUrlPath(url);

				if (!this.isLinkSameOrigin_(uri.getHost())) {
					void 0;
					return false;
				}
				if (!this.isSameBasePath_(path)) {
					void 0;
					return false;
				}
				// Prevents navigation if it's a hash change on the same url.
				if (uri.getHash() && _utils2.default.isCurrentBrowserPath(path)) {
					return false;
				}
				if (!this.findRoute(path)) {
					void 0;
					return false;
				}

				return true;
			}
		}, {
			key: 'clearScreensCache',
			value: function clearScreensCache() {
				var _this4 = this;

				Object.keys(this.screens).forEach(function (path) {
					if (path === _this4.activePath) {
						_this4.activeScreen.clearCache();
					} else if (!(_this4.isNavigationPending && _this4.pendingNavigate.path === path)) {
						_this4.removeScreen(path);
					}
				});
			}
		}, {
			key: 'createScreenInstance',
			value: function createScreenInstance(path, route) {
				if (!this.pendingNavigate && path === this.activePath) {
					void 0;
					return this.activeScreen;
				}
				/* jshint newcap: false */
				var screen = this.screens[path];
				if (!screen) {
					var handler = route.getHandler();
					if (handler === _Screen2.default || _Screen2.default.isImplementedBy(handler.prototype)) {
						screen = new handler();
					} else {
						screen = handler(route) || new _Screen2.default();
					}
					void 0;
				}
				return screen;
			}
		}, {
			key: 'disposeInternal',
			value: function disposeInternal() {
				if (this.activeScreen) {
					this.removeScreen(this.activePath);
				}
				this.clearScreensCache();
				this.formEventHandler_.removeListener();
				this.linkEventHandler_.removeListener();
				this.appEventHandlers_.removeAllListeners();
				_get(App.prototype.__proto__ || Object.getPrototypeOf(App.prototype), 'disposeInternal', this).call(this);
			}
		}, {
			key: 'dispatch',
			value: function dispatch() {
				return this.navigate(_utils2.default.getCurrentBrowserPath(), true);
			}
		}, {
			key: 'doNavigate_',
			value: function doNavigate_(path, opt_replaceHistory) {
				var _this5 = this;

				var route = this.findRoute(path);
				if (!route) {
					this.pendingNavigate = _Promise2.default.reject(new _Promise2.default.CancellationError('No route for ' + path));
					return this.pendingNavigate;
				}

				void 0;

				this.stopPendingNavigate_();
				this.isNavigationPending = true;

				var nextScreen = this.createScreenInstance(path, route);

				return this.maybePreventDeactivate_().then(function () {
					return _this5.maybePreventActivate_(nextScreen);
				}).then(function () {
					return nextScreen.load(path);
				}).then(function () {
					// At this point we cannot stop navigation and all received
					// navigate candidates will be queued at scheduledNavigationQueue.
					_this5.navigationStrategy = NavigationStrategy.SCHEDULE_LAST;

					if (_this5.activeScreen) {
						_this5.activeScreen.deactivate();
					}
					_this5.prepareNavigateHistory_(path, nextScreen, opt_replaceHistory);
					_this5.prepareNavigateSurfaces_(nextScreen, _this5.surfaces, _this5.extractParams(route, path));
				}).then(function () {
					return nextScreen.evaluateStyles(_this5.surfaces);
				}).then(function () {
					return nextScreen.flip(_this5.surfaces);
				}).then(function () {
					return nextScreen.evaluateScripts(_this5.surfaces);
				}).then(function () {
					return _this5.maybeUpdateScrollPositionState_();
				}).then(function () {
					return _this5.syncScrollPositionSyncThenAsync_();
				}).then(function () {
					return _this5.finalizeNavigate_(path, nextScreen);
				}).then(function () {
					return _this5.maybeOverloadBeforeUnload_();
				}).catch(function (reason) {
					_this5.isNavigationPending = false;
					_this5.handleNavigateError_(path, nextScreen, reason);
					throw reason;
				}).thenAlways(function () {
					_this5.navigationStrategy = NavigationStrategy.IMMEDIATE;

					if (_this5.scheduledNavigationQueue.length) {
						var scheduledNavigation = _this5.scheduledNavigationQueue.shift();
						_this5.maybeNavigate_(scheduledNavigation.href, scheduledNavigation);
					}
				});
			}
		}, {
			key: 'extractParams',
			value: function extractParams(route, path) {
				return route.extractParams(this.getRoutePath(path));
			}
		}, {
			key: 'finalizeNavigate_',
			value: function finalizeNavigate_(path, nextScreen) {
				nextScreen.activate();

				if (this.activeScreen && !this.activeScreen.isCacheable()) {
					if (this.activeScreen !== nextScreen) {
						this.removeScreen(this.activePath);
					}
				}

				this.activePath = path;
				this.activeScreen = nextScreen;
				this.browserPathBeforeNavigate = _utils2.default.getCurrentBrowserPathWithoutHash();
				this.screens[path] = nextScreen;
				this.isNavigationPending = false;
				this.pendingNavigate = null;
				_globals2.default.capturedFormElement = null;
				_globals2.default.capturedFormButtonElement = null;
				void 0;
			}
		}, {
			key: 'findRoute',
			value: function findRoute(path) {
				path = this.getRoutePath(path);
				for (var i = 0; i < this.routes.length; i++) {
					var route = this.routes[i];
					if (route.matchesPath(path)) {
						return route;
					}
				}

				return null;
			}
		}, {
			key: 'getAllowPreventNavigate',
			value: function getAllowPreventNavigate() {
				return this.allowPreventNavigate;
			}
		}, {
			key: 'getBasePath',
			value: function getBasePath() {
				return this.basePath;
			}
		}, {
			key: 'getDefaultTitle',
			value: function getDefaultTitle() {
				return this.defaultTitle;
			}
		}, {
			key: 'getFormSelector',
			value: function getFormSelector() {
				return this.formSelector;
			}
		}, {
			key: 'getIgnoreQueryStringFromRoutePath',
			value: function getIgnoreQueryStringFromRoutePath() {
				return this.ignoreQueryStringFromRoutePath;
			}
		}, {
			key: 'getLinkSelector',
			value: function getLinkSelector() {
				return this.linkSelector;
			}
		}, {
			key: 'getLoadingCssClass',
			value: function getLoadingCssClass() {
				return this.loadingCssClass;
			}
		}, {
			key: 'getRoutePath',
			value: function getRoutePath(path) {
				if (this.getIgnoreQueryStringFromRoutePath()) {
					path = _utils2.default.getUrlPathWithoutHashAndSearch(path);
					return _utils2.default.getUrlPathWithoutHashAndSearch(path.substr(this.basePath.length));
				}

				path = _utils2.default.getUrlPathWithoutHash(path);
				return _utils2.default.getUrlPathWithoutHash(path.substr(this.basePath.length));
			}
		}, {
			key: 'getUpdateScrollPosition',
			value: function getUpdateScrollPosition() {
				return this.updateScrollPosition;
			}
		}, {
			key: 'handleNavigateError_',
			value: function handleNavigateError_(path, nextScreen, error) {
				var _this6 = this;

				void 0;
				this.emit('navigationError', {
					error: error,
					nextScreen: nextScreen,
					path: path
				});
				if (!_utils2.default.isCurrentBrowserPath(path)) {
					if (this.isNavigationPending && this.pendingNavigate) {
						this.pendingNavigate.thenAlways(function () {
							return _this6.removeScreen(path);
						}, this);
					} else {
						this.removeScreen(path);
					}
				}
			}
		}, {
			key: 'hasRoutes',
			value: function hasRoutes() {
				return this.routes.length > 0;
			}
		}, {
			key: 'isLinkSameOrigin_',
			value: function isLinkSameOrigin_(host) {
				var hostUri = new _Uri2.default(host);
				var locationHostUri = new _Uri2.default(_globals2.default.window.location.host);

				return hostUri.getPort() === locationHostUri.getPort() && hostUri.getHostname() === locationHostUri.getHostname();
			}
		}, {
			key: 'isSameBasePath_',
			value: function isSameBasePath_(path) {
				return path.indexOf(this.basePath) === 0;
			}
		}, {
			key: 'lockHistoryScrollPosition_',
			value: function lockHistoryScrollPosition_() {
				var state = _globals2.default.window.history.state;
				if (!state) {
					return;
				}
				// Browsers are inconsistent when re-positioning the scroll history on
				// popstate. At some browsers, history scroll happens before popstate, then
				// lock the scroll on the last known position as soon as possible after the
				// current JS execution context and capture the current value. Some others,
				// history scroll happens after popstate, in this case, we bind an once
				// scroll event to lock the las known position. Lastly, the previous two
				// behaviors can happen even on the same browser, hence the race will decide
				// the winner.
				var winner = false;
				var switchScrollPositionRace = function switchScrollPositionRace() {
					_globals2.default.document.removeEventListener('scroll', switchScrollPositionRace, false);
					if (!winner) {
						_globals2.default.window.scrollTo(state.scrollLeft, state.scrollTop);
						winner = true;
					}
				};
				_metal.async.nextTick(switchScrollPositionRace);
				_globals2.default.document.addEventListener('scroll', switchScrollPositionRace, false);
			}
		}, {
			key: 'maybeDisableNativeScrollRestoration',
			value: function maybeDisableNativeScrollRestoration() {
				if (this.nativeScrollRestorationSupported) {
					this.nativeScrollRestoration_ = _globals2.default.window.history.scrollRestoration;
					_globals2.default.window.history.scrollRestoration = 'manual';
				}
			}
		}, {
			key: 'maybeScheduleNavigation_',
			value: function maybeScheduleNavigation_(href, event) {
				if (this.isNavigationPending && this.navigationStrategy === NavigationStrategy.SCHEDULE_LAST) {
					this.scheduledNavigationQueue = [_metal.object.mixin({
						href: href,
						isScheduledNavigation: true
					}, event)];
					return true;
				}
				return false;
			}
		}, {
			key: 'maybeNavigate_',
			value: function maybeNavigate_(href, event) {
				if (!this.canNavigate(href)) {
					return;
				}

				var isNavigationScheduled = this.maybeScheduleNavigation_(href, event);

				if (isNavigationScheduled) {
					event.preventDefault();
					return;
				}

				var navigateFailed = false;
				try {
					this.navigate(_utils2.default.getUrlPath(href), false, event);
				} catch (err) {
					// Do not prevent link navigation in case some synchronous error occurs
					navigateFailed = true;
				}

				if (!navigateFailed && !event.isScheduledNavigation) {
					event.preventDefault();
				}
			}
		}, {
			key: 'maybeOverloadBeforeUnload_',
			value: function maybeOverloadBeforeUnload_() {
				var _this7 = this;

				if ('function' === typeof window.onbeforeunload) {
					window._onbeforeunload = window.onbeforeunload;

					window.onbeforeunload = function (event) {
						_this7.emit('beforeUnload', event);
						if (event && event.defaultPrevented) {
							return true;
						}
					};

					// mark the updated handler due unwanted recursion
					window.onbeforeunload._overloaded = true;
				}
			}
		}, {
			key: 'maybePreventActivate_',
			value: function maybePreventActivate_(nextScreen) {
				var _this8 = this;

				return _Promise2.default.resolve().then(function () {
					return nextScreen.beforeActivate();
				}).then(function (prevent) {
					if (prevent) {
						_this8.pendingNavigate = _Promise2.default.reject(new _Promise2.default.CancellationError('Cancelled by next screen'));
						return _this8.pendingNavigate;
					}
				});
			}
		}, {
			key: 'maybePreventDeactivate_',
			value: function maybePreventDeactivate_() {
				var _this9 = this;

				return _Promise2.default.resolve().then(function () {
					if (_this9.activeScreen) {
						return _this9.activeScreen.beforeDeactivate();
					}
				}).then(function (prevent) {
					if (prevent) {
						_this9.pendingNavigate = _Promise2.default.reject(new _Promise2.default.CancellationError('Cancelled by active screen'));
						return _this9.pendingNavigate;
					}
				});
			}
		}, {
			key: 'maybeRepositionScrollToHashedAnchor',
			value: function maybeRepositionScrollToHashedAnchor() {
				var hash = _globals2.default.window.location.hash;
				if (hash) {
					var anchorElement = _globals2.default.document.getElementById(hash.substring(1));
					if (anchorElement) {
						var _utils$getNodeOffset = _utils2.default.getNodeOffset(anchorElement),
						    offsetLeft = _utils$getNodeOffset.offsetLeft,
						    offsetTop = _utils$getNodeOffset.offsetTop;

						_globals2.default.window.scrollTo(offsetLeft, offsetTop);
					}
				}
			}
		}, {
			key: 'maybeRestoreNativeScrollRestoration',
			value: function maybeRestoreNativeScrollRestoration() {
				if (this.nativeScrollRestorationSupported && this.nativeScrollRestoration_) {
					_globals2.default.window.history.scrollRestoration = this.nativeScrollRestoration_;
				}
			}
		}, {
			key: 'maybeRestoreRedirectPathHash_',
			value: function maybeRestoreRedirectPathHash_(path, redirectPath, hash) {
				if (redirectPath === _utils2.default.getUrlPathWithoutHash(path)) {
					return redirectPath + hash;
				}
				return redirectPath;
			}
		}, {
			key: 'maybeUpdateScrollPositionState_',
			value: function maybeUpdateScrollPositionState_() {
				var hash = _globals2.default.window.location.hash;
				var anchorElement = _globals2.default.document.getElementById(hash.substring(1));
				if (anchorElement) {
					var _utils$getNodeOffset2 = _utils2.default.getNodeOffset(anchorElement),
					    offsetLeft = _utils$getNodeOffset2.offsetLeft,
					    offsetTop = _utils$getNodeOffset2.offsetTop;

					this.saveHistoryCurrentPageScrollPosition_(offsetTop, offsetLeft);
				}
			}
		}, {
			key: 'navigate',
			value: function navigate(path, opt_replaceHistory, opt_event) {
				if (!_utils2.default.isHtml5HistorySupported()) {
					throw new Error('HTML5 History is not supported. Senna will not intercept navigation.');
				}

				if (opt_event) {
					_globals2.default.capturedFormElement = opt_event.capturedFormElement;
					_globals2.default.capturedFormButtonElement = opt_event.capturedFormButtonElement;
				}

				// When reloading the same path do replaceState instead of pushState to
				// avoid polluting history with states with the same path.
				if (path === this.activePath) {
					opt_replaceHistory = true;
				}

				this.emit('beforeNavigate', {
					event: opt_event,
					path: path,
					replaceHistory: !!opt_replaceHistory
				});

				return this.pendingNavigate;
			}
		}, {
			key: 'onBeforeNavigate_',
			value: function onBeforeNavigate_(event) {
				if (_globals2.default.capturedFormElement) {
					event.form = _globals2.default.capturedFormElement;
				}
			}
		}, {
			key: 'onBeforeNavigateDefault_',
			value: function onBeforeNavigateDefault_(event) {
				if (this.pendingNavigate) {
					if (this.pendingNavigate.path === event.path || this.navigationStrategy === NavigationStrategy.SCHEDULE_LAST) {
						void 0;
						return;
					}
				}

				this.emit('beforeUnload', event);

				this.emit('startNavigate', {
					form: event.form,
					path: event.path,
					replaceHistory: event.replaceHistory
				});
			}
		}, {
			key: 'onBeforeUnloadDefault_',
			value: function onBeforeUnloadDefault_(event) {
				var func = window._onbeforeunload;
				if (func && !func._overloaded && func()) {
					event.preventDefault();
				}
			}
		}, {
			key: 'onDocClickDelegate_',
			value: function onDocClickDelegate_(event) {
				if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.button) {
					void 0;
					return;
				}
				this.maybeNavigate_(event.delegateTarget.href, event);
			}
		}, {
			key: 'onDocSubmitDelegate_',
			value: function onDocSubmitDelegate_(event) {
				var form = event.delegateTarget;
				if (form.method === 'get') {
					void 0;
					return;
				}
				event.capturedFormElement = form;
				var buttonSelector = 'button:not([type]),button[type=submit],input[type=submit]';
				if ((0, _dom.match)(_globals2.default.document.activeElement, buttonSelector)) {
					event.capturedFormButtonElement = _globals2.default.document.activeElement;
				} else {
					event.capturedFormButtonElement = form.querySelector(buttonSelector);
				}
				this.maybeNavigate_(form.action, event);
			}
		}, {
			key: 'onLoad_',
			value: function onLoad_() {
				var _this10 = this;

				this.skipLoadPopstate = true;
				setTimeout(function () {
					// The timeout ensures that popstate events will be unblocked right
					// after the load event occured, but not in the same event-loop cycle.
					_this10.skipLoadPopstate = false;
				}, 0);
				// Try to reposition scroll to the hashed anchor when page loads.
				this.maybeRepositionScrollToHashedAnchor();
			}
		}, {
			key: 'onPopstate_',
			value: function onPopstate_(event) {
				if (this.skipLoadPopstate) {
					return;
				}

				// Do not navigate if the popstate was triggered by a hash change.
				if (_utils2.default.isCurrentBrowserPath(this.browserPathBeforeNavigate)) {
					this.maybeRepositionScrollToHashedAnchor();
					return;
				}

				var state = event.state;

				if (!state) {
					if (_globals2.default.window.location.hash) {
						// If senna is on an redirect path and a hash popstate happens
						// to a different url, reload the browser. This behavior doesn't
						// require senna to route hashed links and is closer to native
						// browser behavior.
						if (this.redirectPath && !_utils2.default.isCurrentBrowserPath(this.redirectPath)) {
							this.reloadPage();
						}
						// Always try to reposition scroll to the hashed anchor when
						// hash popstate happens.
						this.maybeRepositionScrollToHashedAnchor();
					} else {
						this.reloadPage();
					}
					return;
				}

				if (state.senna) {
					void 0;
					this.popstateScrollTop = state.scrollTop;
					this.popstateScrollLeft = state.scrollLeft;
					if (!this.nativeScrollRestorationSupported) {
						this.lockHistoryScrollPosition_();
					}
					this.once('endNavigate', function () {
						if (state.referrer) {
							_utils2.default.setReferrer(state.referrer);
						}
					});
					var uri = new _Uri2.default(state.path);
					uri.setHostname(_globals2.default.window.location.hostname);
					uri.setPort(_globals2.default.window.location.port);
					var isNavigationScheduled = this.maybeScheduleNavigation_(uri.toString(), {});
					if (isNavigationScheduled) {
						return;
					}
					this.navigate(state.path, true);
				}
			}
		}, {
			key: 'onScroll_',
			value: function onScroll_() {
				if (this.captureScrollPositionFromScrollEvent) {
					this.saveHistoryCurrentPageScrollPosition_(_globals2.default.window.pageYOffset, _globals2.default.window.pageXOffset);
				}
			}
		}, {
			key: 'onStartNavigate_',
			value: function onStartNavigate_(event) {
				var _this11 = this;

				this.maybeDisableNativeScrollRestoration();
				this.captureScrollPositionFromScrollEvent = false;
				(0, _dom.addClasses)(_globals2.default.document.documentElement, this.loadingCssClass);

				var endNavigatePayload = {
					form: event.form,
					path: event.path
				};

				this.pendingNavigate = this.doNavigate_(event.path, event.replaceHistory).catch(function (reason) {
					endNavigatePayload.error = reason;
					throw reason;
				}).thenAlways(function () {
					if (!_this11.pendingNavigate && !_this11.scheduledNavigationQueue.length) {
						(0, _dom.removeClasses)(_globals2.default.document.documentElement, _this11.loadingCssClass);
						_this11.maybeRestoreNativeScrollRestoration();
						_this11.captureScrollPositionFromScrollEvent = true;
					}
					_this11.emit('endNavigate', endNavigatePayload);
				});

				this.pendingNavigate.path = event.path;
			}
		}, {
			key: 'prefetch',
			value: function prefetch(path) {
				var _this12 = this;

				var route = this.findRoute(path);
				if (!route) {
					return _Promise2.default.reject(new _Promise2.default.CancellationError('No route for ' + path));
				}

				void 0;

				var nextScreen = this.createScreenInstance(path, route);

				return nextScreen.load(path).then(function () {
					return _this12.screens[path] = nextScreen;
				}).catch(function (reason) {
					_this12.handleNavigateError_(path, nextScreen, reason);
					throw reason;
				});
			}
		}, {
			key: 'prepareNavigateHistory_',
			value: function prepareNavigateHistory_(path, nextScreen, opt_replaceHistory) {
				var title = nextScreen.getTitle();
				if (!(0, _metal.isString)(title)) {
					title = this.getDefaultTitle();
				}
				var redirectPath = nextScreen.beforeUpdateHistoryPath(path);
				var hash = new _Uri2.default(path).getHash();
				redirectPath = this.maybeRestoreRedirectPathHash_(path, redirectPath, hash);
				var historyState = {
					form: (0, _metal.isDefAndNotNull)(_globals2.default.capturedFormElement),
					path: path,
					redirectPath: redirectPath,
					scrollLeft: 0,
					scrollTop: 0,
					senna: true
				};
				if (opt_replaceHistory) {
					historyState.scrollTop = this.popstateScrollTop;
					historyState.scrollLeft = this.popstateScrollLeft;
				}
				this.updateHistory_(title, redirectPath, nextScreen.beforeUpdateHistoryState(historyState), opt_replaceHistory);
				this.redirectPath = redirectPath;
			}
		}, {
			key: 'prepareNavigateSurfaces_',
			value: function prepareNavigateSurfaces_(nextScreen, surfaces, params) {
				Object.keys(surfaces).forEach(function (id) {
					var surfaceContent = nextScreen.getSurfaceContent(id, params);
					surfaces[id].addContent(nextScreen.getId(), surfaceContent);
					void 0;
				});
			}
		}, {
			key: 'reloadPage',
			value: function reloadPage() {
				_globals2.default.window.location.reload();
			}
		}, {
			key: 'removeRoute',
			value: function removeRoute(route) {
				return _metal.array.remove(this.routes, route);
			}
		}, {
			key: 'removeScreen',
			value: function removeScreen(path) {
				var _this13 = this;

				var screen = this.screens[path];
				if (screen) {
					Object.keys(this.surfaces).forEach(function (surfaceId) {
						return _this13.surfaces[surfaceId].remove(screen.getId());
					});
					screen.dispose();
					delete this.screens[path];
				}
			}
		}, {
			key: 'saveHistoryCurrentPageScrollPosition_',
			value: function saveHistoryCurrentPageScrollPosition_(scrollTop, scrollLeft) {
				var state = _globals2.default.window.history.state;
				if (state && state.senna) {
					var _ref = [scrollTop, scrollLeft];
					state.scrollTop = _ref[0];
					state.scrollLeft = _ref[1];

					_globals2.default.window.history.replaceState(state, null, null);
				}
			}
		}, {
			key: 'setAllowPreventNavigate',
			value: function setAllowPreventNavigate(allowPreventNavigate) {
				this.allowPreventNavigate = allowPreventNavigate;
			}
		}, {
			key: 'setBasePath',
			value: function setBasePath(basePath) {
				this.basePath = _utils2.default.removePathTrailingSlash(basePath);
			}
		}, {
			key: 'setDefaultTitle',
			value: function setDefaultTitle(defaultTitle) {
				this.defaultTitle = defaultTitle;
			}
		}, {
			key: 'setFormSelector',
			value: function setFormSelector(formSelector) {
				this.formSelector = formSelector;
				if (this.formEventHandler_) {
					this.formEventHandler_.removeListener();
				}
				this.formEventHandler_ = (0, _dom.delegate)(document, 'submit', this.formSelector, this.onDocSubmitDelegate_.bind(this), this.allowPreventNavigate);
			}
		}, {
			key: 'setIgnoreQueryStringFromRoutePath',
			value: function setIgnoreQueryStringFromRoutePath(ignoreQueryStringFromRoutePath) {
				this.ignoreQueryStringFromRoutePath = ignoreQueryStringFromRoutePath;
			}
		}, {
			key: 'setLinkSelector',
			value: function setLinkSelector(linkSelector) {
				this.linkSelector = linkSelector;
				if (this.linkEventHandler_) {
					this.linkEventHandler_.removeListener();
				}
				this.linkEventHandler_ = (0, _dom.delegate)(document, 'click', this.linkSelector, this.onDocClickDelegate_.bind(this), this.allowPreventNavigate);
			}
		}, {
			key: 'setLoadingCssClass',
			value: function setLoadingCssClass(loadingCssClass) {
				this.loadingCssClass = loadingCssClass;
			}
		}, {
			key: 'setUpdateScrollPosition',
			value: function setUpdateScrollPosition(updateScrollPosition) {
				this.updateScrollPosition = updateScrollPosition;
			}
		}, {
			key: 'stopPendingNavigate_',
			value: function stopPendingNavigate_() {
				if (this.pendingNavigate) {
					this.pendingNavigate.cancel('Cancel pending navigation');
				}
				this.pendingNavigate = null;
			}
		}, {
			key: 'syncScrollPositionSyncThenAsync_',
			value: function syncScrollPositionSyncThenAsync_() {
				var _this14 = this;

				var state = _globals2.default.window.history.state;
				if (!state) {
					return;
				}

				var scrollTop = state.scrollTop;
				var scrollLeft = state.scrollLeft;

				var sync = function sync() {
					if (_this14.updateScrollPosition) {
						_globals2.default.window.scrollTo(scrollLeft, scrollTop);
					}
				};

				return new _Promise2.default(function (resolve) {
					return sync() & _metal.async.nextTick(function () {
						return sync() & resolve();
					});
				});
			}
		}, {
			key: 'updateHistory_',
			value: function updateHistory_(title, path, state, opt_replaceHistory) {
				var referrer = _globals2.default.window.location.href;

				if (state) {
					state.referrer = referrer;
				}

				if (opt_replaceHistory) {
					_globals2.default.window.history.replaceState(state, title, path);
				} else {
					_globals2.default.window.history.pushState(state, title, path);
				}

				_utils2.default.setReferrer(referrer);

				var titleNode = _globals2.default.document.querySelector('title');
				if (titleNode) {
					titleNode.innerHTML = title;
				} else {
					_globals2.default.document.title = title;
				}
			}
		}]);

		return App;
	}(_events.EventEmitter);

	exports.default = App;
});
//# sourceMappingURL=App.js.map
