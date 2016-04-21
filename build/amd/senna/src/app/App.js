define(['exports', 'metal/src/metal', 'metal-dom/src/all/dom', 'metal-promise/src/promise/Promise', 'metal-events/src/events', '../utils/utils', '../globals/globals', '../route/Route', '../screen/Screen', '../surface/Surface', 'metal-uri/src/Uri'], function (exports, _metal, _dom, _Promise, _events, _utils, _globals, _Route, _Screen, _Surface, _Uri) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _dom2 = _interopRequireDefault(_dom);

	var _Promise2 = _interopRequireDefault(_Promise);

	var _utils2 = _interopRequireDefault(_utils);

	var _globals2 = _interopRequireDefault(_globals);

	var _Route2 = _interopRequireDefault(_Route);

	var _Screen2 = _interopRequireDefault(_Screen);

	var _Surface2 = _interopRequireDefault(_Surface);

	var _Uri2 = _interopRequireDefault(_Uri);

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

	var App = function (_EventEmitter) {
		_inherits(App, _EventEmitter);

		/**
   * App class that handle routes and screens lifecycle.
   * @constructor
   * @extends {EventEmitter}
   */

		function App() {
			_classCallCheck(this, App);

			var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

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
    * Holds the link selector to define links that are routed.
    * @type {!string}
    * @default a:not([data-senna-off])
    * @protected
    */
			_this.linkSelector = 'a:not([data-senna-off])';

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

			_this.appEventHandlers_.add(_dom2.default.on(_globals2.default.window, 'scroll', _this.onScroll_.bind(_this)), _dom2.default.on(_globals2.default.window, 'load', _this.onLoad_.bind(_this)), _dom2.default.on(_globals2.default.window, 'popstate', _this.onPopstate_.bind(_this)));

			_this.on('startNavigate', _this.onStartNavigate_);
			_this.on('beforeNavigate', _this.onBeforeNavigate_);
			_this.on('beforeNavigate', _this.onBeforeNavigateDefault_, true);

			_this.setLinkSelector(_this.linkSelector);
			_this.setFormSelector(_this.formSelector);
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


		App.prototype.addRoutes = function addRoutes(routes) {
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
		};

		App.prototype.addSurfaces = function addSurfaces(surfaces) {
			var _this3 = this;

			if (!Array.isArray(surfaces)) {
				surfaces = [surfaces];
			}
			surfaces.forEach(function (surface) {
				if (_metal.core.isString(surface)) {
					surface = new _Surface2.default(surface);
				}
				_this3.surfaces[surface.getId()] = surface;
			});
			return this;
		};

		App.prototype.canNavigate = function canNavigate(url) {
			var path = _utils2.default.getUrlPath(url);
			var uri = new _Uri2.default(url);

			if (!this.isLinkSameOrigin_(uri.getHostname())) {
				void 0;
				return false;
			}
			if (!this.isSameBasePath_(path)) {
				void 0;
				return false;
			}
			if (!this.findRoute(path)) {
				void 0;
				return false;
			}

			return true;
		};

		App.prototype.clearScreensCache = function clearScreensCache() {
			var _this4 = this;

			Object.keys(this.screens).forEach(function (path) {
				if (path === _this4.activePath) {
					_this4.activeScreen.clearCache();
				} else {
					_this4.removeScreen(path);
				}
			});
		};

		App.prototype.createScreenInstance = function createScreenInstance(path, route) {
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
		};

		App.prototype.disposeInternal = function disposeInternal() {
			if (this.activeScreen) {
				this.removeScreen(this.activePath);
			}
			this.clearScreensCache();
			this.formEventHandler_.removeListener();
			this.linkEventHandler_.removeListener();
			this.appEventHandlers_.removeAllListeners();
			_EventEmitter.prototype.disposeInternal.call(this);
		};

		App.prototype.dispatch = function dispatch() {
			return this.navigate(_utils2.default.getCurrentBrowserPath(), true);
		};

		App.prototype.doNavigate_ = function doNavigate_(path, opt_replaceHistory) {
			var _this5 = this;

			if (this.activeScreen && this.activeScreen.beforeDeactivate()) {
				this.pendingNavigate = _Promise2.default.reject(new _Promise2.default.CancellationError('Cancelled by active screen'));
				return this.pendingNavigate;
			}

			var route = this.findRoute(path);
			if (!route) {
				this.pendingNavigate = _Promise2.default.reject(new _Promise2.default.CancellationError('No route for ' + path));
				return this.pendingNavigate;
			}

			void 0;

			this.stopPendingNavigate_();

			var nextScreen = this.createScreenInstance(path, route);

			return nextScreen.load(path).then(function () {
				if (_this5.activeScreen) {
					_this5.activeScreen.deactivate();
				}
				_this5.prepareNavigateHistory_(path, nextScreen, opt_replaceHistory);
				_this5.prepareNavigateSurfaces_(nextScreen, _this5.surfaces);
			}).then(function () {
				return nextScreen.evaluateStyles(_this5.surfaces);
			}).then(function () {
				return nextScreen.flip(_this5.surfaces);
			}).then(function () {
				return nextScreen.evaluateScripts(_this5.surfaces);
			}).then(function () {
				return _this5.syncScrollPositionSyncThenAsync_();
			}).then(function () {
				return _this5.finalizeNavigate_(path, nextScreen);
			}).catch(function (reason) {
				_this5.handleNavigateError_(path, nextScreen, reason);
				throw reason;
			});
		};

		App.prototype.finalizeNavigate_ = function finalizeNavigate_(path, nextScreen) {
			nextScreen.activate();

			if (this.activeScreen && !this.activeScreen.isCacheable()) {
				if (this.activeScreen !== nextScreen) {
					this.removeScreen(this.activePath);
				}
			}

			this.activePath = path;
			this.activeScreen = nextScreen;
			this.screens[path] = nextScreen;
			this.pendingNavigate = null;
			_globals2.default.capturedFormElement = null;
			void 0;
		};

		App.prototype.findRoute = function findRoute(path) {
			// Prevents navigation if it's a hash change on the same url.
			if (path.lastIndexOf('#') > -1 && _utils2.default.isCurrentBrowserPath(path)) {
				return null;
			}

			path = _utils2.default.getUrlPathWithoutHash(path);

			// Makes sure that the path substring will be in the expected format
			// (that is, will end with a "/").
			path = _utils2.default.getUrlPathWithoutHash(path.substr(this.basePath.length));

			for (var i = 0; i < this.routes.length; i++) {
				var route = this.routes[i];
				if (route.matchesPath(path)) {
					return route;
				}
			}

			return null;
		};

		App.prototype.getAllowPreventNavigate = function getAllowPreventNavigate() {
			return this.allowPreventNavigate;
		};

		App.prototype.getBasePath = function getBasePath() {
			return this.basePath;
		};

		App.prototype.getDefaultTitle = function getDefaultTitle() {
			return this.defaultTitle;
		};

		App.prototype.getFormSelector = function getFormSelector() {
			return this.formSelector;
		};

		App.prototype.getLinkSelector = function getLinkSelector() {
			return this.linkSelector;
		};

		App.prototype.getLoadingCssClass = function getLoadingCssClass() {
			return this.loadingCssClass;
		};

		App.prototype.getUpdateScrollPosition = function getUpdateScrollPosition() {
			return this.updateScrollPosition;
		};

		App.prototype.handleNavigateError_ = function handleNavigateError_(path, nextScreen, err) {
			void 0;
			if (!_utils2.default.isCurrentBrowserPath(path)) {
				this.removeScreen(path);
			}
		};

		App.prototype.hasRoutes = function hasRoutes() {
			return this.routes.length > 0;
		};

		App.prototype.isLinkSameOrigin_ = function isLinkSameOrigin_(hostname) {
			return hostname === _globals2.default.window.location.hostname;
		};

		App.prototype.isSameBasePath_ = function isSameBasePath_(path) {
			return path.indexOf(this.basePath) === 0;
		};

		App.prototype.lockHistoryScrollPosition_ = function lockHistoryScrollPosition_() {
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
		};

		App.prototype.maybeDisableNativeScrollRestoration = function maybeDisableNativeScrollRestoration() {
			if (this.nativeScrollRestorationSupported) {
				this.nativeScrollRestoration_ = _globals2.default.window.history.scrollRestoration;
				_globals2.default.window.history.scrollRestoration = 'manual';
			}
		};

		App.prototype.maybeNavigate_ = function maybeNavigate_(href, event) {
			if (!this.canNavigate(href)) {
				return;
			}

			if (this.allowPreventNavigate && event.defaultPrevented) {
				void 0;
				return;
			}

			_globals2.default.capturedFormElement = event.capturedFormElement;

			var navigateFailed = false;
			try {
				this.navigate(_utils2.default.getUrlPath(href));
			} catch (err) {
				// Do not prevent link navigation in case some synchronous error occurs
				navigateFailed = true;
			}

			if (!navigateFailed) {
				event.preventDefault();
			}
		};

		App.prototype.maybeRepositionScrollToHashedAnchor = function maybeRepositionScrollToHashedAnchor() {
			var hash = _globals2.default.window.location.hash;
			if (hash) {
				var anchorElement = _globals2.default.document.getElementById(hash.substring(1));
				if (anchorElement) {
					_globals2.default.window.scrollTo(anchorElement.offsetLeft, anchorElement.offsetTop);
				}
			}
		};

		App.prototype.maybeRestoreNativeScrollRestoration = function maybeRestoreNativeScrollRestoration() {
			if (this.nativeScrollRestorationSupported && this.nativeScrollRestoration_) {
				_globals2.default.window.history.scrollRestoration = this.nativeScrollRestoration_;
			}
		};

		App.prototype.navigate = function navigate(path, opt_replaceHistory) {
			if (!_utils2.default.isHtml5HistorySupported()) {
				throw new Error('HTML5 History is not supported. Senna will not intercept navigation.');
			}

			// When reloading the same path do replaceState instead of pushState to
			// avoid polluting history with states with the same path.
			if (path === this.activePath) {
				opt_replaceHistory = true;
			}

			this.emit('beforeNavigate', {
				path: path,
				replaceHistory: !!opt_replaceHistory
			});

			return this.pendingNavigate;
		};

		App.prototype.onBeforeNavigate_ = function onBeforeNavigate_(event) {
			if (_globals2.default.capturedFormElement) {
				event.form = _globals2.default.capturedFormElement;
			}
		};

		App.prototype.onBeforeNavigateDefault_ = function onBeforeNavigateDefault_(event) {
			if (this.pendingNavigate) {
				if (this.pendingNavigate.path === event.path) {
					void 0;
					return;
				}
			}

			this.emit('startNavigate', {
				form: event.form,
				path: event.path,
				replaceHistory: event.replaceHistory
			});
		};

		App.prototype.onDocClickDelegate_ = function onDocClickDelegate_(event) {
			if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.button) {
				void 0;
				return;
			}
			this.maybeNavigate_(event.delegateTarget.href, event);
		};

		App.prototype.onDocSubmitDelegate_ = function onDocSubmitDelegate_(event) {
			var form = event.delegateTarget;
			if (form.method === 'get') {
				void 0;
				return;
			}
			event.capturedFormElement = form;
			this.maybeNavigate_(form.action, event);
		};

		App.prototype.onLoad_ = function onLoad_() {
			var _this6 = this;

			this.skipLoadPopstate = true;
			setTimeout(function () {
				// The timeout ensures that popstate events will be unblocked right
				// after the load event occured, but not in the same event-loop cycle.
				_this6.skipLoadPopstate = false;
			}, 0);
			// Try to reposition scroll to the hashed anchor when page loads.
			this.maybeRepositionScrollToHashedAnchor();
		};

		App.prototype.onPopstate_ = function onPopstate_(event) {
			if (this.skipLoadPopstate) {
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
				this.navigate(state.path, true);
			}
		};

		App.prototype.onScroll_ = function onScroll_() {
			if (this.captureScrollPositionFromScrollEvent) {
				this.saveHistoryCurrentPageScrollPosition_();
			}
		};

		App.prototype.onStartNavigate_ = function onStartNavigate_(event) {
			var _this7 = this;

			this.maybeDisableNativeScrollRestoration();
			this.captureScrollPositionFromScrollEvent = false;
			_dom2.default.addClasses(_globals2.default.document.documentElement, this.loadingCssClass);

			var endNavigatePayload = {
				form: event.form,
				path: event.path
			};

			this.pendingNavigate = this.doNavigate_(event.path, event.replaceHistory).catch(function (reason) {
				endNavigatePayload.error = reason;
				throw reason;
			}).thenAlways(function () {
				if (!_this7.pendingNavigate) {
					_dom2.default.removeClasses(_globals2.default.document.documentElement, _this7.loadingCssClass);
					_this7.maybeRestoreNativeScrollRestoration();
					_this7.captureScrollPositionFromScrollEvent = true;
				}
				_this7.emit('endNavigate', endNavigatePayload);
			});

			this.pendingNavigate.path = event.path;
		};

		App.prototype.prefetch = function prefetch(path) {
			var _this8 = this;

			var route = this.findRoute(path);
			if (!route) {
				return _Promise2.default.reject(new _Promise2.default.CancellationError('No route for ' + path));
			}

			void 0;

			var nextScreen = this.createScreenInstance(path, route);

			return nextScreen.load(path).then(function () {
				return _this8.screens[path] = nextScreen;
			}).catch(function (reason) {
				_this8.handleNavigateError_(path, nextScreen, reason);
				throw reason;
			});
		};

		App.prototype.prepareNavigateHistory_ = function prepareNavigateHistory_(path, nextScreen, opt_replaceHistory) {
			var title = nextScreen.getTitle();
			if (!_metal.core.isString(title)) {
				title = this.getDefaultTitle();
			}
			var redirectPath = nextScreen.beforeUpdateHistoryPath(path);
			var historyState = {
				form: _metal.core.isDefAndNotNull(_globals2.default.capturedFormElement),
				redirectPath: redirectPath,
				path: path,
				senna: true,
				scrollTop: 0,
				scrollLeft: 0
			};
			if (opt_replaceHistory) {
				historyState.scrollTop = this.popstateScrollTop;
				historyState.scrollLeft = this.popstateScrollLeft;
			}
			this.updateHistory_(title, redirectPath, nextScreen.beforeUpdateHistoryState(historyState), opt_replaceHistory);
			this.redirectPath = redirectPath;
		};

		App.prototype.prepareNavigateSurfaces_ = function prepareNavigateSurfaces_(nextScreen, surfaces) {
			Object.keys(surfaces).forEach(function (id) {
				var surfaceContent = nextScreen.getSurfaceContent(id);
				surfaces[id].addContent(nextScreen.getId(), surfaceContent);
				void 0;
			});
		};

		App.prototype.reloadPage = function reloadPage() {
			_globals2.default.window.location.reload();
		};

		App.prototype.removeRoute = function removeRoute(route) {
			return _metal.array.remove(this.routes, route);
		};

		App.prototype.removeScreen = function removeScreen(path) {
			var _this9 = this;

			var screen = this.screens[path];
			if (screen) {
				Object.keys(this.surfaces).forEach(function (surfaceId) {
					return _this9.surfaces[surfaceId].remove(screen.getId());
				});
				screen.dispose();
				delete this.screens[path];
			}
		};

		App.prototype.saveHistoryCurrentPageScrollPosition_ = function saveHistoryCurrentPageScrollPosition_() {
			var state = _globals2.default.window.history.state;
			if (state && state.senna) {
				state.scrollTop = _globals2.default.window.pageYOffset;
				state.scrollLeft = _globals2.default.window.pageXOffset;
				_globals2.default.window.history.replaceState(state, null, null);
			}
		};

		App.prototype.setAllowPreventNavigate = function setAllowPreventNavigate(allowPreventNavigate) {
			this.allowPreventNavigate = allowPreventNavigate;
		};

		App.prototype.setBasePath = function setBasePath(basePath) {
			this.basePath = basePath;
		};

		App.prototype.setDefaultTitle = function setDefaultTitle(defaultTitle) {
			this.defaultTitle = defaultTitle;
		};

		App.prototype.setFormSelector = function setFormSelector(formSelector) {
			this.formSelector = formSelector;
			if (this.formEventHandler_) {
				this.formEventHandler_.removeListener();
			}
			this.formEventHandler_ = _dom2.default.delegate(document, 'submit', this.formSelector, this.onDocSubmitDelegate_.bind(this));
		};

		App.prototype.setLinkSelector = function setLinkSelector(linkSelector) {
			this.linkSelector = linkSelector;
			if (this.linkEventHandler_) {
				this.linkEventHandler_.removeListener();
			}
			this.linkEventHandler_ = _dom2.default.delegate(document, 'click', this.linkSelector, this.onDocClickDelegate_.bind(this));
		};

		App.prototype.setLoadingCssClass = function setLoadingCssClass(loadingCssClass) {
			this.loadingCssClass = loadingCssClass;
		};

		App.prototype.setUpdateScrollPosition = function setUpdateScrollPosition(updateScrollPosition) {
			this.updateScrollPosition = updateScrollPosition;
		};

		App.prototype.stopPendingNavigate_ = function stopPendingNavigate_() {
			if (this.pendingNavigate) {
				this.pendingNavigate.cancel('Cancel pending navigation');
				this.pendingNavigate = null;
			}
		};

		App.prototype.syncScrollPositionSyncThenAsync_ = function syncScrollPositionSyncThenAsync_() {
			var _this10 = this;

			var state = _globals2.default.window.history.state;
			if (!state) {
				return;
			}

			var scrollTop = state.scrollTop;
			var scrollLeft = state.scrollLeft;

			var sync = function sync() {
				if (_this10.updateScrollPosition) {
					_globals2.default.window.scrollTo(scrollLeft, scrollTop);
				}
			};

			return new _Promise2.default(function (resolve) {
				return sync() & _metal.async.nextTick(function () {
					return sync() & resolve();
				});
			});
		};

		App.prototype.updateHistory_ = function updateHistory_(title, path, state, opt_replaceHistory) {
			if (opt_replaceHistory) {
				_globals2.default.window.history.replaceState(state, title, path);
			} else {
				_globals2.default.window.history.pushState(state, title, path);
			}
			_globals2.default.document.title = title;
		};

		return App;
	}(_events.EventEmitter);

	exports.default = App;
});
//# sourceMappingURL=App.js.map