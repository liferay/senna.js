'use strict';

import { dom } from 'metal-dom';
import CancellablePromise from 'metal-promise';
import globals from '../../src/globals/globals';
import utils from '../../src/utils/utils';
import App from '../../src/app/App';
import Route from '../../src/route/Route';
import Screen from '../../src/screen/Screen';
import HtmlScreen from '../../src/screen/HtmlScreen';
import Surface from '../../src/surface/Surface';

describe('App', function() {
	before((done) => {
		detectCanScrollIFrame(done);
	});

	beforeEach(() => {
		var requests = this.requests = [];
		this.xhr = sinon.useFakeXMLHttpRequest();
		this.xhr.onCreate = (xhr) => {
			requests.push(xhr);
		};
		// Prevent log messages from showing up in test output.
		sinon.stub(console, 'log');
	});

	afterEach(() => {
		if (this.app && !this.app.isDisposed()) {
			this.app.dispose();
		}
		this.app = null;
		this.xhr.restore();
		console.log.restore();
	});

	it('should add route', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		var route = this.app.findRoute('/path');
		assert.ok(this.app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
	});

	it('should remove route', () => {
		this.app = new App();
		var route = new Route('/path', Screen);
		this.app.addRoutes(route);
		assert.ok(this.app.removeRoute(route));
	});

	it('should add route from object', () => {
		this.app = new App();
		this.app.addRoutes({
			path: '/path',
			handler: Screen
		});
		var route = this.app.findRoute('/path');
		assert.ok(this.app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
	});

	it('should add route from array', () => {
		this.app = new App();
		this.app.addRoutes([{
			path: '/path',
			handler: Screen
		}, new Route('/pathOther', Screen)]);
		var route = this.app.findRoute('/path');
		assert.ok(this.app.hasRoutes());
		assert.ok(route instanceof Route);
		assert.strictEqual('/path', route.getPath());
		assert.strictEqual(Screen, route.getHandler());
		var routeOther = this.app.findRoute('/pathOther');
		assert.ok(routeOther instanceof Route);
		assert.strictEqual('/pathOther', routeOther.getPath());
		assert.strictEqual(Screen, routeOther.getHandler());
	});

	it('should not find route for not registered paths', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		assert.strictEqual(null, this.app.findRoute('/pathOther'));
	});

	it('should not find route for urls with hashbang when navigate to same basepath', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		globals.window = {
			location: {
				pathname: '/path',
				search: ''
			}
		};
		assert.strictEqual(null, this.app.findRoute('/path#hashbang'));
		globals.window = window;
	});

	it('should find route for urls with hashbang for different basepath', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/pathOther', Screen));
		globals.window = {
			location: {
				pathname: '/path',
				search: ''
			}
		};
		assert.ok(this.app.findRoute('/pathOther#hashbang'));
		globals.window = window;
	});

	it('should add surface', () => {
		this.app = new App();
		this.app.addSurfaces(new Surface('surfaceId'));
		assert.ok(this.app.surfaces.surfaceId);
		assert.strictEqual('surfaceId', this.app.surfaces.surfaceId.getId());
	});

	it('should add surface from surface id', () => {
		this.app = new App();
		this.app.addSurfaces('surfaceId');
		assert.ok(this.app.surfaces.surfaceId);
		assert.strictEqual('surfaceId', this.app.surfaces.surfaceId.getId());
	});

	it('should add surface from array', () => {
		this.app = new App();
		this.app.addSurfaces([new Surface('surfaceId'), 'surfaceIdOther']);
		assert.ok(this.app.surfaces.surfaceId);
		assert.ok(this.app.surfaces.surfaceIdOther);
		assert.strictEqual('surfaceId', this.app.surfaces.surfaceId.getId());
		assert.strictEqual('surfaceIdOther', this.app.surfaces.surfaceIdOther.getId());
	});

	it('should create screen instance to a route', () => {
		this.app = new App();
		var screen = this.app.createScreenInstance('/path', new Route('/path', Screen));
		assert.ok(screen instanceof Screen);
	});

	it('should create screen instance to a route for Screen class child', () => {
		this.app = new App();
		var screen = this.app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		assert.ok(screen instanceof HtmlScreen);
	});

	it('should create screen instance to a route with function handler', () => {
		this.app = new App();
		var stub = sinon.stub();
		var route = new Route('/path', stub);
		var screen = this.app.createScreenInstance('/path', route);
		assert.strictEqual(1, stub.callCount);
		assert.strictEqual(route, stub.args[0][0]);
		assert.strictEqual(undefined, stub.returnValues[0]);
		assert.ok(screen instanceof Screen);
	});

	it('should get same screen instance to a route', () => {
		this.app = new App();
		var route = new Route('/path', Screen);
		var screen = this.app.createScreenInstance('/path', route);
		this.app.screens['/path'] = screen;
		assert.strictEqual(screen, this.app.createScreenInstance('/path', route));
	});

	it('should use same screen instance when simulating navigate refresh', () => {
		this.app = new App();
		var route = new Route('/path', HtmlScreen);
		var screen = this.app.createScreenInstance('/path', route);
		this.app.screens['/path'] = screen;
		this.app.activePath = '/path';
		this.app.activeScreen = screen;
		var screenRefresh = this.app.createScreenInstance('/path', route);
		assert.strictEqual(screen, screenRefresh);
	});

	it('should create different screen instance navigate when not cacheable', (done) => {
		class NoCacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = false;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', NoCacheScreen));
		this.app.addRoutes(new Route('/path2', NoCacheScreen));
		this.app.navigate('/path1').then(() => {
			var screenFirstNavigate = this.app.screens['/path1'];
			this.app.navigate('/path2').then(() => {
				this.app.navigate('/path1').then(() => {
					assert.notStrictEqual(screenFirstNavigate, this.app.screens['/path1']);
					done();
				});
			});
		});
	});

	it('should use same screen instance navigate when is cacheable', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', CacheScreen));
		this.app.addRoutes(new Route('/path2', CacheScreen));
		this.app.navigate('/path1').then(() => {
			var screenFirstNavigate = this.app.screens['/path1'];
			this.app.navigate('/path2').then(() => {
				this.app.navigate('/path1').then(() => {
					assert.strictEqual(screenFirstNavigate, this.app.screens['/path1']);
					done();
				});
			});
		});
	});

	it('should clear screen cache', () => {
		this.app = new App();
		this.app.screens['/path'] = this.app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		this.app.clearScreensCache();
		assert.strictEqual(0, Object.keys(this.app.screens).length);
	});

	it('should clear all screen caches on app dispose', () => {
		this.app = new App();
		var screen1 = this.app.createScreenInstance('/path1', new Route('/path1', HtmlScreen));
		var screen2 = this.app.createScreenInstance('/path2', new Route('/path2', HtmlScreen));
		this.app.activePath = '/path1';
		this.app.activeScreen = screen1;
		this.app.screens['/path1'] = screen1;
		this.app.screens['/path2'] = screen2;
		this.app.dispose();
		assert.strictEqual(0, Object.keys(this.app.screens).length);
	});

	it('should clear screen cache and remove surfaces', () => {
		this.app = new App();
		var surface = new Surface('surfaceId');
		surface.remove = sinon.stub();
		this.app.addSurfaces(surface);
		this.app.screens['/path'] = this.app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		this.app.clearScreensCache();
		assert.strictEqual(1, surface.remove.callCount);
	});

	it('should clear screen cache for activeScreen but not remove it', () => {
		this.app = new App();
		this.app.screens['/path'] = this.app.createScreenInstance('/path', new Route('/path', HtmlScreen));
		this.app.activePath = '/path';
		this.app.activeScreen = this.app.screens['/path'];
		this.app.clearScreensCache();
		assert.strictEqual(1, Object.keys(this.app.screens).length);
		assert.strictEqual(null, this.app.activeScreen.getCache());
	});

	it('should get allow prevent navigate', () => {
		this.app = new App();
		assert.strictEqual(true, this.app.getAllowPreventNavigate());
		this.app.setAllowPreventNavigate(false);
		assert.strictEqual(false, this.app.getAllowPreventNavigate());
	});

	it('should get default title', () => {
		globals.document.title = 'default';
		this.app = new App();
		assert.strictEqual('default', this.app.getDefaultTitle());
		this.app.setDefaultTitle('title');
		assert.strictEqual('title', this.app.getDefaultTitle());
	});

	it('should get basepath', () => {
		this.app = new App();
		assert.strictEqual('', this.app.getBasePath());
		this.app.setBasePath('/base');
		assert.strictEqual('/base', this.app.getBasePath());
	});

	it('should get update scroll position', () => {
		this.app = new App();
		assert.strictEqual(true, this.app.getUpdateScrollPosition());
		this.app.setUpdateScrollPosition(false);
		assert.strictEqual(false, this.app.getUpdateScrollPosition());
	});

	it('should get loading css class', () => {
		this.app = new App();
		assert.strictEqual('senna-loading', this.app.getLoadingCssClass());
		this.app.setLoadingCssClass('');
		assert.strictEqual('', this.app.getLoadingCssClass());
	});

	it('should get form selector', () => {
		this.app = new App();
		assert.strictEqual('form[enctype="multipart/form-data"]:not([data-senna-off])', this.app.getFormSelector());
		this.app.setFormSelector('');
		assert.strictEqual('', this.app.getFormSelector());
	});

	it('should get link selector', () => {
		this.app = new App();
		assert.strictEqual('a:not([data-senna-off])', this.app.getLinkSelector());
		this.app.setLinkSelector('');
		assert.strictEqual('', this.app.getLinkSelector());
	});

	it('should get link selector', () => {
		this.app = new App();
		assert.strictEqual('a:not([data-senna-off])', this.app.getLinkSelector());
		this.app.setLinkSelector('');
		assert.strictEqual('', this.app.getLinkSelector());
	});

	it('should test if can navigate to url', () => {
		this.app = new App();
		globals.window = {
			history: {},
			location: {
				hostname: 'localhost',
				pathname: '/path',
				search: ''
			}
		};
		this.app.setBasePath('/base');
		this.app.addRoutes(new Route('/path', Screen));
		assert.ok(this.app.canNavigate('http://localhost/base/path'));
		assert.ok(!this.app.canNavigate('http://localhost/base/path1'));
		assert.ok(!this.app.canNavigate('http://localhost/path'));
		assert.ok(!this.app.canNavigate('http://external/path'));
		globals.window = window;
	});

	it('should store proper senna state after navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate('/path').then(() => {
			assert.deepEqual({
				form: false,
				redirectPath: '/path',
				path: '/path',
				senna: true,
				scrollTop: 0,
				scrollLeft: 0
			}, globals.window.history.state);
			done();
		});
	});

	it('should navigate emit startNavigate and endNavigate custom event', (done) => {
		var startNavigateStub = sinon.stub();
		var endNavigateStub = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('startNavigate', startNavigateStub);
		this.app.on('endNavigate', endNavigateStub);
		this.app.navigate('/path').then(() => {
			assert.strictEqual(1, startNavigateStub.callCount);
			assert.strictEqual('/path', startNavigateStub.args[0][0].path);
			assert.strictEqual(false, startNavigateStub.args[0][0].replaceHistory);
			assert.strictEqual(1, endNavigateStub.callCount);
			assert.strictEqual('/path', endNavigateStub.args[0][0].path);
			done();
		});
	});

	it('should navigate emit startNavigate and endNavigate custom event with replace history', (done) => {
		var startNavigateStub = sinon.stub();
		var endNavigateStub = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('startNavigate', startNavigateStub);
		this.app.on('endNavigate', endNavigateStub);
		this.app.navigate('/path', true).then(() => {
			assert.strictEqual(1, startNavigateStub.callCount);
			assert.strictEqual('/path', startNavigateStub.args[0][0].path);
			assert.strictEqual(true, startNavigateStub.args[0][0].replaceHistory);
			assert.strictEqual(1, endNavigateStub.callCount);
			assert.strictEqual('/path', endNavigateStub.args[0][0].path);
			done();
		});
	});

	it('should navigate overwrite event.path on beforeNavigate custom event', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.on('beforeNavigate', (event) => {
			event.path = '/path1';
		});
		this.app.navigate('/path').then(() => {
			assert.strictEqual('/path1', globals.window.location.pathname);
			done();
		});
	});

	it('should cancel navigate', (done) => {
		var stub = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
			stub();
		});
		this.app.navigate('/path').catch((reason) => {
			assert.ok(reason instanceof Error);
			assert.strictEqual(1, stub.callCount);
			done();
		}).cancel();
	});

	it('should clear pendingNavigate after navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate('/path').then(() => {
			assert.ok(!this.app.pendingNavigate);
			done();
		});
		assert.ok(this.app.pendingNavigate);
	});

	it('should wait for pendingNavigate if navigate to same path', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', CacheScreen));
		this.app.navigate('/path').then(() => {
			var pendingNavigate1 = this.app.navigate('/path');
			var pendingNavigate2 = this.app.navigate('/path');
			assert.ok(pendingNavigate1);
			assert.ok(pendingNavigate2);
			assert.strictEqual(pendingNavigate1, pendingNavigate2);
			done();
		});
	});

	it('should navigate back when clicking browser back button', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1')
			.then(() => this.app.navigate('/path2'))
			.then(() => {
				var activeScreen = this.app.activeScreen;
				assert.strictEqual('/path2', globals.window.location.pathname);
				this.app.once('endNavigate', () => {
					assert.strictEqual('/path1', globals.window.location.pathname);
					assert.notStrictEqual(activeScreen, this.app.activeScreen);
					done();
				});
				globals.window.history.back();
			});
	});

	it('should only call beforeNavigate when waiting for pendingNavigate if navigate to same path', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', CacheScreen));
		this.app.navigate('/path').then(() => {
			this.app.navigate('/path');
			var beforeNavigate = sinon.stub();
			var startNavigate = sinon.stub();
			this.app.on('beforeNavigate', beforeNavigate);
			this.app.on('startNavigate', startNavigate);
			this.app.navigate('/path');
			assert.strictEqual(1, beforeNavigate.callCount);
			assert.strictEqual(0, startNavigate.callCount);
			done();
		});
	});

	it('should not wait for pendingNavigate if navigate to different path', (done) => {
		class CacheScreen extends Screen {
			constructor() {
				super();
				this.cacheable = true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', CacheScreen));
		this.app.addRoutes(new Route('/path2', CacheScreen));
		this.app.navigate('/path1')
			.then(() => this.app.navigate('/path2'))
			.then(() => {
				var pendingNavigate1 = this.app.navigate('/path1');
				var pendingNavigate2 = this.app.navigate('/path2');
				assert.ok(pendingNavigate1);
				assert.ok(pendingNavigate2);
				assert.notStrictEqual(pendingNavigate1, pendingNavigate2);
				done();
			});
	});

	it('should simulate refresh on navigate to the same path', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.once('startNavigate', (payload) => {
			assert.ok(!payload.replaceHistory);
		});
		this.app.navigate('/path').then(() => {
			this.app.once('startNavigate', (payload) => {
				assert.ok(payload.replaceHistory);
			});
			this.app.navigate('/path').then(() => {
				done();
			});
		});
	});

	it('should add loading css class on navigate', (done) => {
		var containsLoadingCssClass = () => {
			return globals.document.documentElement.classList.contains(this.app.getLoadingCssClass());
		};
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('startNavigate', () => assert.ok(containsLoadingCssClass()));
		this.app.on('endNavigate', () => {
			assert.ok(!containsLoadingCssClass());
			done();
		});
		this.app.navigate('/path').then(() => assert.ok(!containsLoadingCssClass()));
	});

	it('should not remove loading css class on navigate if there is pending navigate', (done) => {
		var containsLoadingCssClass = () => {
			return globals.document.documentElement.classList.contains(this.app.getLoadingCssClass());
		};
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.once('startNavigate', () => {
			this.app.once('startNavigate', () => assert.ok(containsLoadingCssClass()));
			this.app.once('endNavigate', () => assert.ok(containsLoadingCssClass()));
			this.app.navigate('/path2').then(() => {
				assert.ok(!containsLoadingCssClass());
				done();
			});
		});
		this.app.navigate('/path1');
	});

	it('should not navigate to unrouted paths', (done) => {
		this.app = new App();
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
		});
		this.app.navigate('/path', true).catch((reason) => {
			assert.ok(reason instanceof Error);
			done();
		});
	});

	it('should store scroll position on page scroll', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		this.app = new App();
		setTimeout(() => {
			assert.strictEqual(100, globals.window.history.state.scrollTop);
			assert.strictEqual(100, globals.window.history.state.scrollLeft);
			hidePageScrollbar();
			done();
		}, 100);
		globals.window.scrollTo(100, 100);
	});

	it('should not store page scroll position during navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('startNavigate', () => {
			this.app.onScroll_(); // Coverage
			assert.ok(!this.app.captureScrollPositionFromScrollEvent);
		});
		assert.ok(this.app.captureScrollPositionFromScrollEvent);
		this.app.navigate('/path').then(() => {
			assert.ok(this.app.captureScrollPositionFromScrollEvent);
			done();
		});
	});

	it('should update scroll position on navigate', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			setTimeout(() => {
				this.app.navigate('/path2').then(() => {
					assert.strictEqual(0, window.pageXOffset);
					assert.strictEqual(0, window.pageYOffset);
					hidePageScrollbar();
					done();
				});
			}, 100);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should not update scroll position on navigate if updateScrollPosition is disabled', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		this.app = new App();
		this.app.setUpdateScrollPosition(false);
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			setTimeout(() => {
				this.app.navigate('/path2').then(() => {
					assert.strictEqual(100, window.pageXOffset);
					assert.strictEqual(100, window.pageYOffset);
					hidePageScrollbar();
					done();
				});
			}, 100);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should restore scroll position on navigate back', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			setTimeout(() => {
				this.app.navigate('/path2').then(() => {
					assert.strictEqual(0, window.pageXOffset);
					assert.strictEqual(0, window.pageYOffset);
					this.app.once('endNavigate', () => {
						assert.strictEqual(100, window.pageXOffset);
						assert.strictEqual(100, window.pageYOffset);
						hidePageScrollbar();
						done();
					});
					globals.window.history.back();
				});
			}, 100);
			globals.window.scrollTo(100, 100);
		});
	});

	it('should dispatch navigate to current path', (done) => {
		globals.window.history.replaceState({}, '', '/path1?foo=1#hash');
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('endNavigate', (payload) => {
			assert.strictEqual('/path1?foo=1#hash', payload.path);
			globals.window.history.replaceState({}, '', utils.getCurrentBrowserPath());
			done();
		});
		this.app.dispatch();
	});

	it('should not navigate if active screen forbid deactivate', (done) => {
		class NoNavigateScreen extends Screen {
			beforeDeactivate() {
				return true;
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path1', NoNavigateScreen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			this.app.on('endNavigate', (payload) => {
				assert.ok(payload.error instanceof Error);
			});
			this.app.navigate('/path2').catch((reason) => {
				assert.ok(reason instanceof Error);
				done();
			});
		});
	});

	it('should prefetch paths', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.prefetch('/path').then(() => {
			assert.ok(this.app.screens['/path'] instanceof Screen);
			done();
		});
	});

	it('should prefetch fail on navigate to unrouted paths', (done) => {
		this.app = new App();
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
		});
		this.app.prefetch('/path').catch((reason) => {
			assert.ok(reason instanceof Error);
			done();
		});
	});

	it('should cancel prefetch', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('endNavigate', (payload) => {
			assert.ok(payload.error instanceof Error);
		});
		this.app.prefetch('/path').catch((reason) => {
			assert.ok(reason instanceof Error);
			done();
		}).cancel();
	});

	it('should navigate when clicking on routed links', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		dom.triggerEvent(enterDocumentLinkElement('/path'), 'click');
		assert.ok(this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when clicking on external links', () => {
		var link = enterDocumentLinkElement('http://sennajs.com');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when clicking on links outside basepath', () => {
		var link = enterDocumentLinkElement('/path');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.setBasePath('/base');
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when clicking on unrouted links', () => {
		var link = enterDocumentLinkElement('/path');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when clicking on links with invalid mouse button or modifier keys pressed', () => {
		var link = enterDocumentLinkElement('/path');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click', {
			altKey: true
		});
		dom.triggerEvent(link, 'click', {
			ctrlKey: true
		});
		dom.triggerEvent(link, 'click', {
			metaKey: true
		});
		dom.triggerEvent(link, 'click', {
			shiftKey: true
		});
		dom.triggerEvent(link, 'click', {
			button: true
		});
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should not navigate when navigate fails synchronously', () => {
		var link = enterDocumentLinkElement('/path');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate = () => {
			throw new Error();
		};
		dom.on(link, 'click', preventDefault);
		dom.triggerEvent(link, 'click');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentLinkElement();
	});

	it('should reload page on navigate back to a routed page without history state', (done) => {
		this.app = new App();
		this.app.reloadPage = sinon.stub();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			window.history.replaceState(null, null, null);
			this.app.navigate('/path2').then(() => {
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual(1, this.app.reloadPage.callCount);
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should not reload page on navigate back to a routed page with same path containing hashbang without history state', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.reloadPage = sinon.stub();
		this.app.navigate('/path').then(() => {
			globals.window.location.hash = 'hash1';
			window.history.replaceState(null, null, null);
			this.app.navigate('/path').then(() => {
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual(0, this.app.reloadPage.callCount);
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should reload page on navigate back to a routed page with different path containing hashbang without history state', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.reloadPage = sinon.stub();
		this.app.navigate('/path1').then(() => {
			globals.window.location.hash = 'hash1';
			window.history.replaceState(null, null, null);
			this.app.navigate('/path2').then(() => {
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual(1, this.app.reloadPage.callCount);
					done();
				});
				globals.window.history.back();
			});
		});
	});

	it('should not reload page on clicking links with same path containing different hashbang without history state', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.reloadPage = sinon.stub();
		window.history.replaceState(null, null, '/path#hash1');
		dom.once(globals.window, 'popstate', () => {
			assert.strictEqual(0, this.app.reloadPage.callCount);
			done();
		});
		dom.triggerEvent(globals.window, 'popstate');
	});

	it('should resposition scroll to hashed anchors on hash popstate', (done) => {
		if (!canScrollIFrame_) {
			done();
			return;
		}

		showPageScrollbar();
		var link = enterDocumentLinkElement('/path');
		link.style.position = 'absolute';
		link.style.top = '1000px';
		link.style.left = '1000px';
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate('/path').then(() => {
			globals.window.location.hash = 'link';
			window.history.replaceState(null, null, null);
			globals.window.location.hash = 'other';
			window.history.replaceState(null, null, null);
			dom.once(globals.window, 'popstate', () => {
				assert.strictEqual(1000, window.pageXOffset);
				assert.strictEqual(1000, window.pageYOffset);
				exitDocumentLinkElement();
				hidePageScrollbar();

				dom.once(globals.window, 'popstate', () => {
					done();
				});
				globals.window.history.back();
			});
			globals.window.history.back();
		});
	});

	it('should not reload page on navigate back to a routed page without history state and skipLoadPopstate is active', (done) => {
		this.app = new App();
		this.app.reloadPage = sinon.stub();
		this.app.addRoutes(new Route('/path1', Screen));
		this.app.addRoutes(new Route('/path2', Screen));
		this.app.navigate('/path1').then(() => {
			window.history.replaceState(null, null, null);
			this.app.navigate('/path2').then(() => {
				dom.once(globals.window, 'popstate', () => {
					assert.strictEqual(0, this.app.reloadPage.callCount);
					done();
				});
				this.app.skipLoadPopstate = true;
				globals.window.history.back();
			});
		});
	});

	it('should navigate when submitting routed forms', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		dom.triggerEvent(enterDocumentFormElement('/path', 'post'), 'submit');
		assert.ok(this.app.pendingNavigate);
		this.app.on('endNavigate', () => {
			exitDocumentFormElement();
			done();
		});
	});

	it('should not navigate when submitting routed forms if submit event was prevented', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		var form = enterDocumentFormElement('/path', 'post');
		dom.once(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.ok(!this.app.pendingNavigate);
		exitDocumentFormElement();
	});

	it('should not capture form element when submit event was prevented', () => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		var form = enterDocumentFormElement('/path', 'post');
		dom.once(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.ok(!globals.capturedFormElement);
		exitDocumentFormElement();
	});

	it('should expose form reference in event data when submitting routed forms', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		dom.triggerEvent(enterDocumentFormElement('/path', 'post'), 'submit');
		this.app.on('startNavigate', (data) => {
			assert.ok(data.form);
		});
		this.app.on('endNavigate', (data) => {
			assert.ok(data.form);
			exitDocumentFormElement();
			done();
		});
	});

	it('should not navigate when submitting forms with method get', () => {
		var form = enterDocumentFormElement('/path', 'get');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentFormElement();
	});

	it('should not navigate when submitting on external forms', () => {
		var form = enterDocumentFormElement('http://sennajs.com', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentFormElement();
	});

	it('should not navigate when submitting on forms outside basepath', () => {
		var form = enterDocumentFormElement('/path', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.setBasePath('/base');
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentFormElement();
	});

	it('should not navigate when submitting on unrouted forms', () => {
		var form = enterDocumentFormElement('/path', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.strictEqual(null, this.app.pendingNavigate);
		exitDocumentFormElement();
	});

	it('should not capture form if navigate fails when submitting forms', () => {
		var form = enterDocumentFormElement('/path', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.ok(!globals.capturedFormElement);
		exitDocumentFormElement();
	});

	it('should capture form on beforeNavigate', (done) => {
		var form = enterDocumentFormElement('/path', 'post');
		this.app = new App();
		this.app.setAllowPreventNavigate(false);
		this.app.addRoutes(new Route('/path', Screen));
		this.app.on('beforeNavigate', (event) => {
			assert.ok(event.form);
			exitDocumentFormElement();
			done();
		});
		dom.on(form, 'submit', preventDefault);
		dom.triggerEvent(form, 'submit');
		assert.ok(globals.capturedFormElement);
	});

	it('should set redirect path if history path was redirected', (done) => {
		class RedirectScreen extends Screen {
			beforeUpdateHistoryPath() {
				return '/redirect';
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', RedirectScreen));
		this.app.navigate('/path').then(() => {
			assert.strictEqual('/redirect', this.app.redirectPath);
			assert.strictEqual('/path', this.app.activePath);
			done();
		});
	});

	it('should skipLoadPopstate before page is loaded', (done) => {
		this.app = new App();
		this.app.onLoad_(); // Simulate
		assert.ok(this.app.skipLoadPopstate);
		setTimeout(() => {
			assert.ok(!this.app.skipLoadPopstate);
			done();
		}, 0);
	});

	it('should respect screen lifecycle on navigate', (done) => {
		class StubScreen1 extends Screen {
		}
		StubScreen1.prototype.activate = sinon.spy();
		StubScreen1.prototype.beforeDeactivate = sinon.spy();
		StubScreen1.prototype.deactivate = sinon.spy();
		StubScreen1.prototype.flip = sinon.spy();
		StubScreen1.prototype.load = sinon.stub().returns(CancellablePromise.resolve());
		StubScreen1.prototype.disposeInternal = sinon.spy();
		StubScreen1.prototype.evaluateStyles = sinon.spy();
		StubScreen1.prototype.evaluateScripts = sinon.spy();
		class StubScreen2 extends Screen {
		}
		StubScreen2.prototype.activate = sinon.spy();
		StubScreen2.prototype.beforeDeactivate = sinon.spy();
		StubScreen2.prototype.deactivate = sinon.spy();
		StubScreen2.prototype.flip = sinon.spy();
		StubScreen2.prototype.load = sinon.stub().returns(CancellablePromise.resolve());
		StubScreen2.prototype.evaluateStyles = sinon.spy();
		StubScreen2.prototype.evaluateScripts = sinon.spy();
		this.app = new App();
		this.app.addRoutes(new Route('/path1', StubScreen1));
		this.app.addRoutes(new Route('/path2', StubScreen2));
		this.app.navigate('/path1').then(() => {
			this.app.navigate('/path2').then(() => {
				var lifecycleOrder = [
					StubScreen1.prototype.load,
					StubScreen1.prototype.evaluateStyles,
					StubScreen1.prototype.flip,
					StubScreen1.prototype.evaluateScripts,
					StubScreen1.prototype.activate,
					StubScreen1.prototype.beforeDeactivate,
					StubScreen2.prototype.load,
					StubScreen1.prototype.deactivate,
					StubScreen2.prototype.evaluateStyles,
					StubScreen2.prototype.flip,
					StubScreen2.prototype.evaluateScripts,
					StubScreen2.prototype.activate,
					StubScreen1.prototype.disposeInternal
				];
				for (var i = 1; i < lifecycleOrder.length - 1; i++) {
					assert.ok(lifecycleOrder[i - 1].calledBefore(lifecycleOrder[i]));
				}
				done();
			});
		});
	});

	it('should render surfaces', (done) => {
		class ContentScreen extends Screen {
			getSurfaceContent(surfaceId) {
				return surfaceId;
			}
			getId() {
				return 'screenId';
			}
		}
		var surface = new Surface('surfaceId');
		surface.addContent = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path', ContentScreen));
		this.app.addSurfaces(surface);
		this.app.navigate('/path').then(() => {
			assert.strictEqual(1, surface.addContent.callCount);
			assert.strictEqual('screenId', surface.addContent.args[0][0]);
			assert.strictEqual('surfaceId', surface.addContent.args[0][1]);
			done();
		});
	});

	it('should render default surface content when not provided by screen', (done) => {
		class ContentScreen1 extends Screen {
			getSurfaceContent(surfaceId) {
				if (surfaceId === 'surfaceId1') {
					return 'content1';
				}
			}
			getId() {
				return 'screenId1';
			}
		}
		class ContentScreen2 extends Screen {
			getSurfaceContent(surfaceId) {
				if (surfaceId === 'surfaceId2') {
					return 'content2';
				}
			}
			getId() {
				return 'screenId2';
			}
		}
		dom.enterDocument('<div id="surfaceId1"><div id="surfaceId1-default">default1</div></div>');
		dom.enterDocument('<div id="surfaceId2"><div id="surfaceId2-default">default2</div></div>');
		var surface1 = new Surface('surfaceId1');
		var surface2 = new Surface('surfaceId2');
		surface1.addContent = sinon.stub();
		surface2.addContent = sinon.stub();
		this.app = new App();
		this.app.addRoutes(new Route('/path1', ContentScreen1));
		this.app.addRoutes(new Route('/path2', ContentScreen2));
		this.app.addSurfaces([surface1, surface2]);
		this.app.navigate('/path1').then(() => {
			assert.strictEqual(1, surface1.addContent.callCount);
			assert.strictEqual('screenId1', surface1.addContent.args[0][0]);
			assert.strictEqual('content1', surface1.addContent.args[0][1]);
			assert.strictEqual(1, surface2.addContent.callCount);
			assert.strictEqual('screenId1', surface2.addContent.args[0][0]);
			assert.strictEqual(undefined, surface2.addContent.args[0][1]);
			assert.strictEqual('default2', surface2.getChild('default').innerHTML);
			this.app.navigate('/path2').then(() => {
				assert.strictEqual(2, surface1.addContent.callCount);
				assert.strictEqual('screenId2', surface1.addContent.args[1][0]);
				assert.strictEqual(undefined, surface1.addContent.args[1][1]);
				assert.strictEqual('default1', surface1.getChild('default').innerHTML);
				assert.strictEqual(2, surface2.addContent.callCount);
				assert.strictEqual('screenId2', surface2.addContent.args[1][0]);
				assert.strictEqual('content2', surface2.addContent.args[1][1]);
				dom.exitDocument(surface1.getElement());
				dom.exitDocument(surface2.getElement());
				done();
			});
		});
	});

	it('should add surface content after history path is updated', (done) => {
		var surface = new Surface('surfaceId');
		surface.addContent = () => {
			assert.strictEqual('/path', globals.window.location.pathname);
		};
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.addSurfaces(surface);
		this.app.navigate('/path').then(() => {
			done();
		});
	});

	it('should not navigate when HTML5 History api is not supported', () => {
		var original = utils.isHtml5HistorySupported;
		assert.throws(() => {
			this.app = new App();
			this.app.addRoutes(new Route('/path', Screen));
			utils.isHtml5HistorySupported = () => {
				return false;
			};
			this.app.navigate('/path');
		}, Error);
		utils.isHtml5HistorySupported = original;
	});

	it('should set document title from screen title', (done) => {
		class TitledScreen extends Screen {
			getTitle() {
				return 'title';
			}
		}
		this.app = new App();
		this.app.addRoutes(new Route('/path', TitledScreen));
		this.app.navigate('/path').then(() => {
			assert.strictEqual('title', globals.document.title);
			done();
		});
	});

	it('should set globals.capturedFormElement to null after navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', Screen));
		this.app.navigate('/path').then(() => {
			assert.strictEqual(null, globals.capturedFormElement);
			done();
		});
	});

	it('should cancel nested promises on canceled navigate', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', HtmlScreen));
		this.app.navigate('/path')
			.then(() => assert.fail())
			.catch(() => {
				assert.ok(this.requests[0].aborted);
				done();
			})
			.cancel();
	});

	it('should cancel nested promises on canceled prefetch', (done) => {
		this.app = new App();
		this.app.addRoutes(new Route('/path', HtmlScreen));
		this.app.prefetch('/path')
			.then(() => assert.fail())
			.catch(() => {
				assert.ok(this.requests[0].aborted);
				done();
			})
			.cancel();
	});

});

var canScrollIFrame_ = false;
/**
 * Checks if the current browser allows scrolling iframes. Mobile Safari doesn't
 * allow it, so we have to skip any tests that require window scrolling, since
 * these tests all run inside an iframe.
 */
function detectCanScrollIFrame(done) {
	showPageScrollbar();
	dom.once(document, 'scroll', () => {
		canScrollIFrame_ = true;
	});
	window.scrollTo(100, 100);
	setTimeout(() => {
		hidePageScrollbar();
		done();
	}, 1000);
}

function enterDocumentLinkElement(href) {
	dom.enterDocument('<a id="link" href="' + href + '">link</a>');
	return document.getElementById('link');
}

function enterDocumentFormElement(action, method) {
	dom.enterDocument('<form id="form" action="' + action + '" method="' + method + '" enctype="multipart/form-data"></form>');
	return document.getElementById('form');
}

function exitDocumentLinkElement() {
	dom.exitDocument(document.getElementById('link'));
}

function exitDocumentFormElement() {
	dom.exitDocument(document.getElementById('form'));
}

function preventDefault(event) {
	event.preventDefault();
}

function showPageScrollbar() {
	globals.document.documentElement.style.height = '9999px';
	globals.document.documentElement.style.width = '9999px';
}

function hidePageScrollbar() {
	globals.document.documentElement.style.height = '';
	globals.document.documentElement.style.width = '';
}
