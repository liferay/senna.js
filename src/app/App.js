'use strict';

import async from 'bower:metal/src/async/async';
import core from 'bower:metal/src/core';
import debounce from 'bower:metal-debounce/src/debounce';
import dom from 'bower:metal/src/dom/dom';
import EventEmitter from 'bower:metal/src/events/EventEmitter';
import EventHandler from 'bower:metal/src/events/EventHandler';
import CancellablePromise from 'bower:metal-promise/src/promise/Promise';
import globals from '../globals/globals';
import Route from '../route/Route';
import Screen from '../screen/Screen';
import Surface from '../surface/Surface';

class App extends EventEmitter {

	/**
	 * App class that handle routes and screens lifecycle.
	 * @constructor
	 * @extends {EventEmitter}
	 */
	constructor() {
		super();

		/**
		 * Holds the active screen.
		 * @type {?Screen}
		 * @protected
		 */
		this.activeScreen = null;

		/**
		 * Holds the active path containing the query parameters.
		 * @type {?string}
		 * @protected
		 */
		this.activePath = null;

		/**
		 * Holds link base path.
		 * @type {!string}
		 * @default ''
		 * @protected
		 */
		this.basePath = '';

		/**
		 * Captures scroll position and saves on history state.
		 * @type {!boolean}
		 * @default true
		 * @protected
		 */
		this.captureHistoryScrollPosition = true;

		/**
		 * Holds the default page title.
		 * @type {string}
		 * @default null
		 * @protected
		 */
		this.defaultTitle = '';

		/**
		 * Holds the link selector to define links that are routed.
		 * @type {!string}
		 * @default a:not([data-senna-off])
		 * @protected
		 */
		this.linkSelector = 'a:not([data-senna-off])';

		/**
		 * Holds the loading css class.
		 * @type {!string}
		 * @default senna-loading
		 * @protected
		 */
		this.loadingCssClass = 'senna-loading';

		/**
		 * Holds the window horizontal scroll position when the navigation using
		 * back or forward happens to be restored after the surfaces are updated.
		 * @type {!Number}
		 * @default 0
		 * @protected
		 */
		this.syncScrollLeft = 0;

		/**
		 * Holds the window vertical scroll position when the navigation using
		 * back or forward happens to be restored after the surfaces are updated.
		 * @type {!Number}
		 * @default 0
		 * @protected
		 */
		this.syncScrollTop = 0;

		/**
		 * Holds a deferred withe the current navigation.
		 * @type {?CancellablePromise}
		 * @default null
		 * @protected
		 */
		this.pendingNavigate = null;

		/**
		 * Holds the screen routes configuration.
		 * @type {?Array}
		 * @default []
		 * @protected
		 */
		this.routes = [];

		/**
		 * Maps the screen instances by the url containing the parameters.
		 * @type {?Object}
		 * @default {}
		 * @protected
		 */
		this.screens = {};

		/**
		 * Holds the scroll event handle.
		 * @type {Object}
		 * @default null
		 * @protected
		 */
		this.scrollHandle = null;

		/**
		 * Holds the scroll position capturing delay.
		 * @type {!number}
		 * @default 50
		 * @protected
		 */
		this.scrollPositionCapturingDelay = 50;

		/**
		 * When set to true the first erroneous popstate fired on page load will be
		 * ignored, only if <code>globals.window.history.state</code> is also
		 * <code>null</code>.
		 * @type {boolean}
		 * @default false
		 * @protected
		 */
		this.skipLoadPopstate = false;

		/**
		 * Maps that index the surfaces instances by the surface id.
		 * @type {?Object}
		 * @default {}
		 * @protected
		 */
		this.surfaces = {};

		/**
		 * When set to true, moves the scroll position using the
		 * <code>syncScrollLeft</code> and <code>syncScrollTop</code> values.
		 * @type {!boolean}
		 * @default true
		 * @protected
		 */
		this.updateScrollPosition = true;

		this.appEventHandlers_ = new EventHandler();

		this.appEventHandlers_.add(
			dom.on(globals.document, 'scroll', debounce(this.onScroll_.bind(this), this.scrollPositionCapturingDelay)),
			dom.on(globals.window, 'load', this.onLoad_.bind(this)),
			dom.on(globals.window, 'popstate', this.onPopstate_.bind(this))
		);

		this.on('startNavigate', this.onStartNavigate_);

		this.setLinkSelector(this.linkSelector);
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
	addRoutes(routes) {
		if (!Array.isArray(routes)) {
			routes = [routes];
		}
		routes.forEach((route) => {
			if (!(route instanceof Route)) {
				route = new Route(route.path, route.handler);
			}
			this.routes.push(route);
		});
		return this;
	}

	/**
	 * Adds one or more surfaces to the application.
	 * @param {Surface|String|Array.<Surface|String>} surfaces
	 *     Surface element id or surface instance. You can also pass an Array
	 *     whichcontains surface instances or id. In case of ID, these should be
	 *     the id of surface element.
	 * @chainable
	 */
	addSurfaces(surfaces) {
		if (!Array.isArray(surfaces)) {
			surfaces = [surfaces];
		}
		surfaces.forEach((surface) => {
			if (core.isString(surface)) {
				surface = new Surface(surface);
			}
			this.surfaces[surface.getId()] = surface;
		});
		return this;
	}

	/**
	 * Clear screens cache.
	 * @chainable
	 */
	clearScreensCache() {
		Object.keys(this.screens).forEach((path) => {
			if (path !== this.activePath) {
				this.removeScreen_(path, this.screens[path]);
			}
		});
	}

	/**
	 * Retrieves or create a screen instance to a path.
	 * @param {!string} path Path containing the querystring part.
	 * @return {Screen}
	 */
	createScreenInstance(path, route) {
		var cachedScreen;
		if (path === this.activePath) {
			// When simulating page refresh the request lifecycle must be respected,
			// hence create a new screen instance for the same path.
			console.log('Already at destination, refresh navigation');
			cachedScreen = this.screens[path];
			delete this.screens[path];
		}
		/* jshint newcap: false */
		var screen = this.screens[path];
		if (!screen) {
			console.log('Create screen for [' + path + ']');
			var handler = route.getHandler();
			if (handler === Screen || Screen.isImplementedBy(handler.prototype)) {
				screen = new handler();
			} else {
				screen = handler(route) || new Screen();
			}
			if (cachedScreen) {
				screen.addCache(cachedScreen.getCache());
			}
		}
		return screen;
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		if (this.activeScreen) {
			this.removeScreen_(this.activePath, this.activeScreen);
		}
		this.linkEventHandler_.removeListener();
		this.appEventHandlers_.removeAllListeners();
		super.disposeInternal();
	}

	/**
	 * Dispatches to the first route handler that matches the current path, if
	 * any.
	 * @return {CancellablePromise} Returns a pending request cancellable promise.
	 */
	dispatch() {
		var currentPath = globals.window.location.pathname + globals.window.location.search + globals.window.location.hash;
		return this.navigate(currentPath, true);
	}

	/**
	 * Starts navigation to a path.
	 * @param {!string} path Path containing the querystring part.
	 * @param {boolean=} opt_replaceHistory Replaces browser history.
	 * @return {CancellablePromise} Returns a pending request cancellable promise.
	 */
	doNavigate_(path, opt_replaceHistory) {
		if (this.activeScreen && this.activeScreen.beforeDeactivate()) {
			this.pendingNavigate = CancellablePromise.reject(new CancellablePromise.CancellationError('Cancelled by active screen'));
			return this.pendingNavigate;
		}

		var route = this.findRoute(path);
		if (!route) {
			this.pendingNavigate = CancellablePromise.reject(new CancellablePromise.CancellationError('No route for ' + path));
			return this.pendingNavigate;
		}

		console.log('Navigate to [' + path + ']');

		var nextScreen = this.createScreenInstance(path, route);

		this.pendingNavigate = CancellablePromise.resolve()
			.then(() => {
				return nextScreen.load(path);
			})
			.then((contents) => {
				Object.keys(this.surfaces).forEach((surfaceId) => this.surfaces[surfaceId].addContent(nextScreen.getId(), nextScreen.getSurfaceContent(surfaceId, contents)));
				if (this.activeScreen) {
					this.activeScreen.deactivate();
				}
				return nextScreen.flip(this.surfaces);
			})
			.then(() => {
				this.finalizeNavigate_(path, nextScreen, opt_replaceHistory);
			})
			.catch((reason) => {
				this.handleNavigateError_(path, nextScreen, reason);
				throw reason;
			});

		return this.pendingNavigate;
	}

	/**
	 * Finalizes a screen navigation.
	 * @param {!string} path Path containing the querystring part.
	 * @param {!Screen} nextScreen
	 * @param {boolean=} opt_replaceHistory Replaces browser history.
	 * @protected
	 */
	finalizeNavigate_(path, nextScreen, opt_replaceHistory) {
		var activeScreen = this.activeScreen;
		var title = nextScreen.getTitle() || this.getDefaultTitle();

		this.updateHistory_(title, path, opt_replaceHistory);

		this.syncScrollPosition_(opt_replaceHistory);

		globals.document.title = title;

		nextScreen.activate();

		if (activeScreen && !activeScreen.isCacheable()) {
			this.removeScreen_(this.activePath, activeScreen);
		}

		this.activePath = path;
		this.activeScreen = nextScreen;
		this.screens[path] = nextScreen;
		this.pendingNavigate = null;
		this.captureHistoryScrollPosition = true;
		console.log('Navigation done');
	}

	/**
	 * Finds a route for the test path. Returns true if matches has a route,
	 * otherwise returns null.
	 * @param {!string} path Path containing the querystring part.
	 * @return {?Object} Route handler if match any or <code>null</code> if the
	 *     path is the same as the current url and the path contains a fragment.
	 */
	findRoute(path) {
		var basePath = this.basePath;

		// Prevents navigation if it's a hash change on the same url.
		var hashIndex = path.lastIndexOf('#');
		if (hashIndex > -1) {
			path = path.substr(0, hashIndex);
			if (path === globals.window.location.pathname + globals.window.location.search) {
				return null;
			}
		}

		path = path.substr(basePath.length);

		for (var i = 0; i < this.routes.length; i++) {
			var route = this.routes[i];
			if (route.matchesPath(path)) {
				return route;
			}
		}

		return null;
	}

	/**
	 * Gets link base path.
	 * @return {!string}
	 */
	getBasePath() {
		return this.basePath;
	}

	/**
	 * Gets the default page title.
	 * @return {string} defaultTitle
	 */
	getDefaultTitle() {
		return this.defaultTitle;
	}

	/**
	 * Gets the link selector.
	 * @return {!string}
	 */
	getLinkSelector() {
		return this.linkSelector;
	}

	/**
	 * Gets the loading css class.
	 * @return {!string}
	 */
	getLoadingCssClass() {
		return this.loadingCssClass;
	}

	/**
	 * Gets the update scroll position value.
	 * @return {boolean}
	 */
	getUpdateScrollPosition() {
		return this.updateScrollPosition;
	}

	/**
	 * Gets the scroll position capturing delay.
	 * @return {number}
	 */
	getScrollPositionCapturingDelay() {
		return this.scrollPositionCapturingDelay;
	}

	/**
	 * Handle navigation error.
	 * @param {!string} path Path containing the querystring part.
	 * @param {!Screen} nextScreen
	 * @param {!Error} error
	 * @protected
	 */
	handleNavigateError_(path, nextScreen, err) {
		console.log('Navigation error for [' + nextScreen + '] (' + err + ')');
		this.removeScreen_(path, nextScreen);
		this.pendingNavigate = null;
	}

	/**
	 * Checks if app has routes.
	 * @return {boolean}
	 */
	hasRoutes() {
		return this.routes.length > 0;
	}

	/**
	 * Tests if hostname is an offsite link.
	 * @param {!string} hostname Link hostname to compare with
	 *     <code>globals.window.location.hostname</code>.
	 * @return {boolean}
	 * @protected
	 */
	isLinkSameOrigin_(hostname) {
		return hostname === globals.window.location.hostname;
	}

	/**
	 * Tests if link element has the same app's base path.
	 * @param {!string} path Link path containing the querystring part.
	 * @return {boolean}
	 * @protected
	 */
	isSameBasePath_(path) {
		return path.indexOf(this.basePath) === 0;
	}

	/**
	 * Lock the document scroll in order to avoid the browser native back and
	 * forward navigation to change the scroll position. Surface app takes care
	 * of updating it when surfaces are ready.
	 * @protected
	 */
	lockHistoryScrollPosition_() {
		var state = globals.window.history.state;
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
		var switchScrollPositionRace = function() {
			globals.document.removeEventListener('scroll', switchScrollPositionRace, false);
			if (!winner) {
				globals.window.scrollTo(state.scrollLeft, state.scrollTop);
				winner = true;
			}
		};
		async.nextTick(switchScrollPositionRace);
		globals.document.addEventListener('scroll', switchScrollPositionRace, false);
	}

	/**
	 * Navigates to the specified path if there is a route handler that matches.
	 * @param {!string} path Path to navigate containing the base path.
	 * @param {boolean=} opt_replaceHistory Replaces browser history.
	 * @return {CancellablePromise} Returns a pending request cancellable promise.
	 */
	navigate(path, opt_replaceHistory) {
		this.stopPending_();

		// When reloading the same path do replaceState instead of pushState to
		// avoid polluting history with states with the same path.
		if (path === this.activePath) {
			opt_replaceHistory = true;
		}

		this.emit('startNavigate', {
			path: path,
			replaceHistory: !!opt_replaceHistory
		});

		return this.pendingNavigate;
	}

	/**
	 * Prefetches the specified path if there is a route handler that matches.
	 * @param {!string} path Path to navigate containing the base path.
	 * @return {CancellablePromise} Returns a pending request cancellable promise.
	 */
	prefetch(path) {
		var route = this.findRoute(path);
		if (!route) {
			return CancellablePromise.reject(new CancellablePromise.CancellationError('No route for ' + path));
		}

		console.log('Prefetching [' + path + ']');

		var nextScreen = this.createScreenInstance(path, route);

		var pendingPrefetch = CancellablePromise.resolve()
			.then(() => {
				return nextScreen.load(path);
			})
			.then(() => {
				this.screens[path] = nextScreen;
			})
			.catch((reason) => {
				this.removeScreen_(path, nextScreen);
				throw reason;
			});

		return pendingPrefetch;
	}

	/**
	 * Intercepts document clicks and test link elements in order to decide
	 * whether Surface app can navigate.
	 * @param {!Event} event Event facade
	 * @protected
	 */
	onDocClickDelegate_(event) {
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.button) {
			console.log('Navigate aborted, invalid mouse button or modifier key pressed.');
			return;
		}

		var link = event.delegateTarget;
		var path = link.pathname + link.search + link.hash;
		var navigateFailed = false;

		if (!this.isLinkSameOrigin_(link.hostname)) {
			console.log('Offsite link clicked');
			return;
		}
		if (!this.isSameBasePath_(path)) {
			console.log('Link clicked outside app\'s base path');
			return;
		}
		if (!this.findRoute(path)) {
			console.log('No route for ' + path);
			return;
		}

		try {
			this.navigate(path);
		} catch (err) {
			// Do not prevent link navigation in case some synchronous error occurs
			navigateFailed = true;
		}

		if (!navigateFailed) {
			event.preventDefault();
		}
	}

	/**
	 * Listens to the window's load event in order to avoid issues with some browsers
	 * that trigger popstate calls on the first load. For more information see
	 * http://stackoverflow.com/questions/6421769/popstate-on-pages-load-in-chrome.
	 * @protected
	 */
	onLoad_() {
		this.skipLoadPopstate = true;
		setTimeout(() => {
			// The timeout ensures that popstate events will be unblocked right
			// after the load event occured, but not in the same event-loop cycle.
			this.skipLoadPopstate = false;
		}, 0);
	}

	/**
	 * Handles browser history changes and fires app's navigation if the state
	 * belows to us. If we detect a popstate and the state is <code>null</code>,
	 * assume it is navigating to an external page or to a page we don't have
	 * route, then <code>globals.window.location.reload()</code> is invoked in order to
	 * reload the content to the current url.
	 * @param {!Event} event Event facade
	 * @protected
	 */
	onPopstate_(event) {
		var state = event.state;

		if (state === null || state.isNullState) {
			if (this.skipLoadPopstate) {
				return;
			}
			if (!globals.window.location.hash) {
				this.reloadPage();
				return;
			}
		}

		if (state && state.senna) {
			console.log('History navigation to [' + state.path + ']');
			this.syncScrollTop = state.scrollTop;
			this.syncScrollLeft = state.scrollLeft;
			this.lockHistoryScrollPosition_();
			this.navigate(state.path, true);
		}
	}

	/**
	 * Listens document scroll changes in order to capture the possible lock
	 * scroll position for history scrolling.
	 * @protected
	 */
	onScroll_() {
		if (this.captureHistoryScrollPosition) {
			this.storeScrollPosition_(globals.window.pageXOffset, globals.window.pageYOffset);
		}
	}

	/**
	 * Starts navigation to a path.
	 * @param {!Event} event Event facade containing <code>path</code> and
	 *     <code>replaceHistory</code>.
	 * @protected
	 */
	onStartNavigate_(event) {
		this.captureHistoryScrollPosition = false;

		this.storeScrollPosition_(globals.window.pageXOffset, globals.window.pageYOffset);

		dom.addClasses(globals.document.documentElement, this.loadingCssClass);

		var endNavigatePayload = {};

		this.pendingNavigate = this.doNavigate_(event.path, event.replaceHistory)
			.catch((err) => {
				this.stopPending_();
				endNavigatePayload.error = err;
				throw err;
			})
			.thenAlways(() => {
				endNavigatePayload.path = event.path;
				this.emit('endNavigate', endNavigatePayload);
				dom.removeClasses(globals.document.documentElement, this.loadingCssClass);
			});
	}

	/**
	 * Reloads the page by performing `window.location.reload()`.
	 */
	reloadPage() {
		globals.window.location.reload();
	}

	/**
	 * Removes a screen.
	 * @param {!string} path Path containing the querystring part.
	 * @param {!Screen} screen
	 * @protected
	 */
	removeScreen_(path, screen) {
		Object.keys(this.surfaces).forEach((surfaceId) => this.surfaces[surfaceId].remove(screen.getId()));
		screen.dispose();
		delete this.screens[path];
	}

	/**
	 * Sets link base path.
	 * @param {!string} path
	 */
	setBasePath(basePath) {
		this.basePath = basePath;
	}

	/**
	 * Sets the default page title.
	 * @param {string} defaultTitle
	 */
	setDefaultTitle(defaultTitle) {
		this.defaultTitle = defaultTitle;
	}

	/**
	 * Sets the link selector.
	 * @param {!string} linkSelector
	 */
	setLinkSelector(linkSelector) {
		this.linkSelector = linkSelector;
		if (this.linkEventHandler_) {
			this.linkEventHandler_.removeListener();
		}
		this.linkEventHandler_ = dom.delegate(document, 'click', this.linkSelector, this.onDocClickDelegate_.bind(this));
	}

	/**
	 * Sets the loading css class.
	 * @param {!string} loadingCssClass
	 */
	setLoadingCssClass(loadingCssClass) {
		this.loadingCssClass = loadingCssClass;
	}

	/**
	 * Sets the scroll position capturing delay.
	 * @param {!number} scrollPositionCapturingDelay
	 */
	setScrollPositionCapturingDelay(scrollPositionCapturingDelay) {
		this.scrollPositionCapturingDelay = scrollPositionCapturingDelay;
	}

	/**
	 * Sets the update scroll position value.
	 * @param {boolean} updateScrollPosition
	 */
	setUpdateScrollPosition(updateScrollPosition) {
		this.updateScrollPosition = updateScrollPosition;
	}

	/**
	 * Cancels pending navigate with <code>Cancel pending navigation</code> error.
	 * @protected
	 */
	stopPending_() {
		if (this.pendingNavigate) {
			this.pendingNavigate.cancel('Cancel pending navigation');
			this.pendingNavigate = null;
		}
	}

	/**
	 * Updates or replace browser history.
	 * @param {!string} path Path containing the querystring part.
	 * @param {?string} title Document title.
	 * @param {boolean=} opt_replaceHistory Replaces browser history.
	 * @protected
	 */
	updateHistory_(title, path, opt_replaceHistory) {
		var historyParams = {
			path: path,
			senna: true
		};

		if (opt_replaceHistory) {
			globals.window.history.replaceState(historyParams, title, path);
		} else {
			globals.window.history.pushState(historyParams, title, path);
		}
	}

	/**
	 * Stores scroll position and saves on history state.
	 * @param {!Number} scrollLeft
	 * @param {!Number} scrollTop
	 */
	storeScrollPosition_(scrollLeft, scrollTop) {
		var state = globals.window.history.state || {};
		if (core.isNull(globals.window.history.state)) {
			state.isNullState = true;
		}
		state.scrollLeft = scrollLeft;
		state.scrollTop = scrollTop;
		globals.window.history.replaceState(state, null, null);
	}

	/**
	 * Sync document scroll position to the values captured when the default
	 * back and forward navigation happened. The scroll position updates after
	 * <code>beforeFlip</code> is called and before the surface transitions.
	 * @param {boolean=} opt_replaceHistory Replaces browser history.
	 * @protected
	 */
	syncScrollPosition_(opt_replaceHistory) {
		var scrollLeft = opt_replaceHistory ? this.syncScrollLeft : 0;
		var scrollTop = opt_replaceHistory ? this.syncScrollTop : 0;

		if (this.updateScrollPosition) {
			globals.window.scrollTo(scrollLeft, scrollTop);
		}

		this.storeScrollPosition_(scrollLeft, scrollTop);
	}

}

export default App;